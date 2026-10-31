/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './storage';
import { CanopyCommand, CropRow, CanopySystem } from '../types';

export interface CommandExecutionResult {
  success: boolean;
  commandId: string;
  message: string;
  safetyViolation?: string;
}

class CanopyControlEngine {
  private activeIntervals: Map<string, number> = new Map();

  /**
   * Execute or simulate canopy command with rigorous safety pipeline
   * Supports PARALLEL COLUMN-WISE RETRACTABLE OVERHEAD NET SECTIONS
   */
  public async executeCommand(params: {
    canopySystemId: string;
    plotId: string;
    targetSectionIds?: string[];
    targetRowNumbers?: number[];
    action: 'open' | 'close' | 'stop' | 'emergency_stop'; // 'close' = deploy net along crop rows, 'open' = retract net to headpost
    reason: string;
    bypassWindLockout?: boolean;
    currentWindSpeedKmh?: number;
  }): Promise<CommandExecutionResult> {
    const user = db.getCurrentUser();
    const canopySystem = db.getCanopySystems().find((s) => s.id === params.canopySystemId);
    const plot = db.getPlotById(params.plotId);

    if (!canopySystem || !plot) {
      return {
        success: false,
        commandId: '',
        message: 'Invalid Canopy System or Plot reference.',
      };
    }

    // Safety Check 1: Emergency Stop already tripped
    if (canopySystem.emergencyStopEngaged && params.action !== 'emergency_stop') {
      return {
        success: false,
        commandId: '',
        message: 'CANOPY LOCKED: Emergency Stop is currently engaged! Reset the safety interlock switch before issuing motion commands.',
        safetyViolation: 'EMERGENCY_STOP_ACTIVE',
      };
    }

    // Resolve target sections and rows
    const allSections = db.getSections(params.plotId);
    let targetSections = allSections;
    if (params.targetSectionIds && params.targetSectionIds.length > 0) {
      targetSections = allSections.filter((s) => params.targetSectionIds!.includes(s.id));
    }

    let targetRows: number[] = [];
    if (params.targetRowNumbers && params.targetRowNumbers.length > 0) {
      targetRows = params.targetRowNumbers;
    } else {
      // Aggregate rows from target sections
      targetRows = Array.from(new Set(targetSections.flatMap((s) => s.assignedRowNumbers)));
    }

    // Safety Check 2: High wind speed lock
    const windSpeed = params.currentWindSpeedKmh ?? 14.5;
    if (
      params.action === 'close' && // 'close' means deploying overhead canopy net
      windSpeed > canopySystem.windSpeedLockoutKmh &&
      !params.bypassWindLockout
    ) {
      const msg = `WIND INTERLOCK TRIPPED: Measured wind speed (${windSpeed.toFixed(1)} km/h) exceeds safe overhead canopy deployment limit (${canopySystem.windSpeedLockoutKmh} km/h). Deploying overhead netting in high crosswinds risks excessive uplift and structural cable deflection.`;
      
      db.addAlert({
        id: `alert-wind-${Date.now()}`,
        farmId: plot.farmId,
        plotId: plot.id,
        title: 'Safety Interlock: Parallel Net Deployment Aborted',
        description: msg,
        severity: 'warning',
        category: 'canopy',
        timestamp: new Date().toISOString(),
        isRead: false,
        recommendedAction: 'Wait for wind gusts to settle below threshold or inspect overhead cable tension.',
      });

      return {
        success: false,
        commandId: '',
        message: msg,
        safetyViolation: 'HIGH_WIND_INTERLOCK',
      };
    }

    // Emergency Stop Handling
    if (params.action === 'emergency_stop') {
      return this.handleEmergencyStop(canopySystem, plot, params.reason || 'User Software E-Stop');
    }

    // Create the command record (State: Created)
    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const command: CanopyCommand = {
      id: commandId,
      canopySystemId: canopySystem.id,
      plotId: plot.id,
      targetSectionIds: targetSections.map((s) => s.id),
      targetSectionNames: targetSections.map((s) => s.name),
      targetRowNumbers: targetRows,
      action: params.action,
      state: 'created',
      issuedByUserId: user.id,
      issuedByName: user.name,
      issuedByRole: user.role,
      reason: params.reason,
      createdAt: new Date().toISOString(),
      isSimulated: canopySystem.simulationMode,
    };
    db.saveCommand(command);

    // Pipeline Step 1 -> Step 2: Dispatched to IoT Gateway
    setTimeout(() => {
      command.state = 'dispatched';
      command.dispatchedAt = new Date().toISOString();
      db.saveCommand(command);

      // Pipeline Step 2 -> Step 3: Device Acknowledges over RS-485 Modbus RTU
      setTimeout(() => {
        command.state = 'acknowledged';
        command.acknowledgedAt = new Date().toISOString();
        db.saveCommand(command);

        if (params.action === 'stop') {
          this.haltSectionsMotion(params.plotId, targetSections.map((s) => s.id), targetRows);
          command.state = 'completed';
          command.completedAt = new Date().toISOString();
          db.saveCommand(command);
          return;
        }

        // Pipeline Step 3 -> Step 4: Motor begins moving
        command.state = 'motor_moving';
        db.saveCommand(command);

        this.startLongitudinalMotion(
          params.plotId,
          targetSections.map((s) => s.id),
          targetRows,
          params.action as 'open' | 'close',
          commandId
        );
      }, 400);
    }, 350);

    // Audit log
    const sectionNamesLabel = targetSections.map((s) => `Sec ${s.sectionNumber}`).join(', ');
    db.logActivity({
      farmId: plot.farmId,
      plotId: plot.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      actionType: `CANOPY_${params.action.toUpperCase()}`,
      description: `${params.action.toUpperCase()} command initiated for Parallel Overhead Sections [${sectionNamesLabel}] on ${plot.name}. ${canopySystem.simulationMode ? '(SIMULATION MODE)' : '(PHYSICAL RS485 BUS)'}`,
      metadata: { commandId, sections: targetSections.map((s) => s.id), rows: targetRows, action: params.action },
    });

    return {
      success: true,
      commandId,
      message: `Command [${params.action.toUpperCase()}] queued and dispatched to Parallel Canopy Controller.`,
    };
  }

  private handleEmergencyStop(canopySystem: CanopySystem, plot: any, reason: string): CommandExecutionResult {
    // Immediately trip canopy system
    canopySystem.emergencyStopEngaged = true;
    canopySystem.emergencyStopSource = 'software_ui';
    canopySystem.status = 'fault';
    db.saveCanopySystem(canopySystem);

    // Halt all parallel longitudinal sections in plot
    const sections = db.getSections(plot.id);
    const stoppedSections = sections.map((s) => ({
      ...s,
      motionState: 'stopped' as const,
      motorCurrentAmps: 0.0,
      lastOperationTime: new Date().toISOString(),
    }));
    db.updateSectionsBulk(stoppedSections);

    // Halt all rows in plot
    const rows = db.getRows(plot.id);
    const stoppedRows: CropRow[] = rows.map((r) => ({
      ...r,
      canopyState: 'stopped' as const,
      motorCurrentAmps: 0.0,
      lastOperationTime: new Date().toISOString(),
    }));
    db.updateRowsBulk(stoppedRows);

    // Clear any active motion timers
    this.activeIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.activeIntervals.clear();

    const cmdId = `cmd-estop-${Date.now()}`;
    const user = db.getCurrentUser();
    db.saveCommand({
      id: cmdId,
      canopySystemId: canopySystem.id,
      plotId: plot.id,
      targetSectionIds: sections.map((s) => s.id),
      targetSectionNames: sections.map((s) => s.name),
      targetRowNumbers: rows.map((r) => r.rowNumber),
      action: 'emergency_stop',
      state: 'completed',
      issuedByUserId: user.id,
      issuedByName: user.name,
      issuedByRole: user.role,
      reason: `EMERGENCY STOP TRIGGERED: ${reason}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      isSimulated: canopySystem.simulationMode,
    });

    db.addAlert({
      id: `alert-estop-${Date.now()}`,
      farmId: plot.farmId,
      plotId: plot.id,
      title: 'CRITICAL: Canopy Overhead Emergency Stop Engaged',
      description: `Emergency Stop was triggered by ${user.name} (${user.role}). All overhead winch drives de-energized. Note: For certified safety on field, physical rotary isolator takes precedence.`,
      severity: 'critical',
      category: 'canopy',
      timestamp: new Date().toISOString(),
      isRead: false,
      recommendedAction: 'Inspect overhead longitudinal carrier cables and ensure clear clearance above crops before clearing E-Stop lockout.',
    });

    db.logActivity({
      farmId: plot.farmId,
      plotId: plot.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      actionType: 'EMERGENCY_STOP',
      description: `EMERGENCY STOP engaged for ${plot.name}. All longitudinal winch motors halted immediately.`,
    });

    return {
      success: true,
      commandId: cmdId,
      message: 'EMERGENCY STOP ACTIVATED: Overhead cable winch relay power isolated and all sections halted.',
    };
  }

  public resetEmergencyStop(canopySystemId: string, plotId: string) {
    const system = db.getCanopySystems().find((s) => s.id === canopySystemId);
    if (system) {
      system.emergencyStopEngaged = false;
      system.status = 'operational';
      db.saveCanopySystem(system);

      const user = db.getCurrentUser();
      db.logActivity({
        farmId: db.getActiveFarmId(),
        plotId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        actionType: 'ESTOP_RESET',
        description: `Emergency Stop manually cleared by ${user.name}. Overhead cable lines and limits verified.`,
      });
    }
  }

  private haltSectionsMotion(plotId: string, sectionIds: string[], rowNumbers: number[]) {
    const sections = db.getSections(plotId);
    const updatedSecs = sections.map((s) => {
      if (sectionIds.includes(s.id)) {
        return {
          ...s,
          motionState: 'stopped' as const,
          motorCurrentAmps: 0.0,
        };
      }
      return s;
    });
    db.updateSectionsBulk(updatedSecs);

    const rows = db.getRows(plotId);
    const updatedRows = rows.map((r) => {
      if (rowNumbers.includes(r.rowNumber)) {
        return {
          ...r,
          canopyState: 'stopped' as const,
          motorCurrentAmps: 0.0,
        };
      }
      return r;
    });
    db.updateRowsBulk(updatedRows);
  }

  private startLongitudinalMotion(
    plotId: string,
    targetSectionIds: string[],
    targetRowNumbers: number[],
    action: 'open' | 'close',
    commandId: string
  ) {
    const targetPercent = action === 'close' ? 100 : 0; // 100 = full canopy cover, 0 = retracted to headpost
    const targetSectionState = action === 'close' ? 'deploying' : 'retracting';
    const targetRowState = action === 'close' ? 'closing' : 'opening';

    // Set initial moving states for sections
    let currentSections = db.getSections(plotId);
    const affectedSections = currentSections.map((s) => {
      if (targetSectionIds.includes(s.id)) {
        return {
          ...s,
          motionState: targetSectionState as 'deploying' | 'retracting',
          motorCurrentAmps: 2.4,
          limitSwRetractedActive: false,
          limitSwDeployedActive: false,
        };
      }
      return s;
    });
    db.updateSectionsBulk(affectedSections);

    // Set initial moving state for rows
    let currentRows = db.getRows(plotId);
    const affectedRows = currentRows.map((r) => {
      if (targetRowNumbers.includes(r.rowNumber)) {
        return {
          ...r,
          canopyState: targetRowState as 'closing' | 'opening',
          motorCurrentAmps: 2.2,
          limitSwitchOpenActive: false,
          limitSwitchClosedActive: false,
        };
      }
      return r;
    });
    db.updateRowsBulk(affectedRows);

    // Stepped progressive travel simulation along longitudinal crop rows
    let step = 0;
    const totalSteps = 6;
    const intervalKey = `${plotId}-${commandId}`;

    const interval = window.setInterval(() => {
      step++;

      // Update sections
      const sectionsNow = db.getSections(plotId);
      const nextSections = sectionsNow.map((s) => {
        if (!targetSectionIds.includes(s.id)) return s;
        if (s.motionState !== 'deploying' && s.motionState !== 'retracting') return s;

        const currentPos = s.positionPercent;
        const delta = (targetPercent - currentPos) / (totalSteps - step + 1);
        const nextPos = Math.round(currentPos + delta);

        if (step >= totalSteps) {
          const finalState = action === 'close' ? 'deployed' : 'retracted';
          return {
            ...s,
            positionPercent: targetPercent,
            motionState: finalState as 'deployed' | 'retracted',
            motorCurrentAmps: 0.0,
            limitSwRetractedActive: targetPercent === 0,
            limitSwDeployedActive: targetPercent === 100,
            lastOperationTime: new Date().toISOString(),
          };
        }

        return {
          ...s,
          positionPercent: Math.max(0, Math.min(100, nextPos)),
          motorCurrentAmps: 2.4 + (Math.random() * 0.4 - 0.2),
        };
      });
      db.updateSectionsBulk(nextSections);

      // Synchronize rows
      const rowsNow = db.getRows(plotId);
      const nextRows = rowsNow.map((r) => {
        if (!targetRowNumbers.includes(r.rowNumber)) return r;
        if (r.canopyState !== 'closing' && r.canopyState !== 'opening') return r;

        const currentPos = r.positionPercent;
        const delta = (targetPercent - currentPos) / (totalSteps - step + 1);
        const nextPos = Math.round(currentPos + delta);

        if (step >= totalSteps) {
          const finalState = action === 'close' ? 'closed' : 'open';
          return {
            ...r,
            positionPercent: targetPercent,
            canopyState: finalState as 'closed' | 'open',
            motorCurrentAmps: 0.0,
            limitSwitchOpenActive: targetPercent === 0,
            limitSwitchClosedActive: targetPercent === 100,
            lastOperationTime: new Date().toISOString(),
          };
        }

        return {
          ...r,
          positionPercent: Math.max(0, Math.min(100, nextPos)),
          motorCurrentAmps: 2.1 + (Math.random() * 0.3 - 0.15),
        };
      });
      db.updateRowsBulk(nextRows);

      if (step >= totalSteps) {
        clearInterval(interval);
        this.activeIntervals.delete(intervalKey);

        // Update command to completed
        const commands = db.getCommands();
        const cmd = commands.find((c) => c.id === commandId);
        if (cmd) {
          cmd.state = 'completed';
          cmd.completedAt = new Date().toISOString();
          db.saveCommand(cmd);
        }
      }
    }, 700);

    this.activeIntervals.set(intervalKey, interval);
  }
}

export const canopyControlEngine = new CanopyControlEngine();

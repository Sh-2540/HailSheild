/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trees,
  Grid,
  Plus,
  MapPin,
  Layers,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShieldX,
  Calendar,
  Columns3,
  Droplet,
  Compass,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { Farm, Plot, CropRow, CropType, LongitudinalSection } from '../../types';
import { db } from '../../services/storage';

interface FarmPlotManagerProps {
  farms: Farm[];
  plots: Plot[];
  rows: CropRow[];
  activeFarmId: string;
  initialSubTab?: 'farms' | 'plots' | 'rows';
  onSelectFarm: (farmId: string) => void;
  onSaveFarm: (farm: Farm) => void;
  onDeleteFarm: (farmId: string) => void;
  onSavePlot: (plot: Plot) => void;
  onDeletePlot: (plotId: string) => void;
  onNavigateToCanopy?: (plotId?: string) => void;
}

export const FarmPlotManager: React.FC<FarmPlotManagerProps> = ({
  farms,
  plots,
  rows,
  activeFarmId,
  initialSubTab = 'farms',
  onSelectFarm,
  onSaveFarm,
  onDeleteFarm,
  onSavePlot,
  onDeletePlot,
  onNavigateToCanopy,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'farms' | 'plots' | 'rows'>(initialSubTab);

  // Modals
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  // Farm Form State
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmTaluka, setFarmTaluka] = useState('Dindori');
  const [farmDistrict, setFarmDistrict] = useState('Nashik');
  const [farmGpsLat, setFarmGpsLat] = useState('20.0894');
  const [farmGpsLng, setFarmGpsLng] = useState('73.7431');
  const [farmAreaAcres, setFarmAreaAcres] = useState('10.0');
  const [farmSoilType, setFarmSoilType] = useState('Black Basaltic Clay Loam (Kali Clay)');
  const [farmWaterSource, setFarmWaterSource] = useState('Drip Irrigation via Farm Pond & Canal');
  const [farmNotes, setFarmNotes] = useState('');

  // Plot Form State
  const [plotName, setPlotName] = useState('');
  const [plotNumber, setPlotNumber] = useState('Plot 1');
  const [plotAreaAcres, setPlotAreaAcres] = useState('3.0');
  const [plotCropType, setPlotCropType] = useState<CropType>('Grapes');
  const [plotVariety, setPlotVariety] = useState('Thompson Seedless');
  const [plotPlantingDate, setPlotPlantingDate] = useState('2024-01-15');
  const [plotGrowthStage, setPlotGrowthStage] = useState<Plot['growthStage']>('Fruit Set');
  const [plotRowCount, setPlotRowCount] = useState('10');
  const [plotRowSpacing, setPlotRowSpacing] = useState('2.75');
  const [plotCanopyInstalled, setPlotCanopyInstalled] = useState(true);
  const [plotNotes, setPlotNotes] = useState('');

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];
  const farmPlots = plots.filter((p) => p.farmId === activeFarm?.id);
  const allSections = db.getSections();

  // Open Farm Modal
  const openNewFarmModal = () => {
    setEditingFarm(null);
    setFarmName('');
    setFarmLocation('');
    setFarmTaluka('Dindori');
    setFarmDistrict('Nashik');
    setFarmGpsLat('20.0894');
    setFarmGpsLng('73.7431');
    setFarmAreaAcres('10.0');
    setFarmSoilType('Black Basaltic Clay Loam (Kali Clay)');
    setFarmWaterSource('Drip Irrigation via Farm Pond & Canal');
    setFarmNotes('');
    setIsFarmModalOpen(true);
  };

  const openEditFarmModal = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmName(farm.name);
    setFarmLocation(farm.location);
    setFarmTaluka(farm.taluka);
    setFarmDistrict(farm.district);
    setFarmGpsLat(farm.gpsLat.toString());
    setFarmGpsLng(farm.gpsLng.toString());
    setFarmAreaAcres(farm.totalAreaAcres.toString());
    setFarmSoilType(farm.soilType);
    setFarmWaterSource(farm.waterSource);
    setFarmNotes(farm.notes);
    setIsFarmModalOpen(true);
  };

  const handleSaveFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    const farm: Farm = {
      id: editingFarm ? editingFarm.id : `farm-${Date.now()}`,
      name: farmName.trim(),
      ownerId: db.getCurrentUser().id,
      ownerName: db.getCurrentUser().name,
      location: farmLocation.trim() || 'Nashik District',
      taluka: farmTaluka.trim() || 'Dindori',
      district: farmDistrict.trim() || 'Nashik',
      state: 'Maharashtra',
      gpsLat: parseFloat(farmGpsLat) || 20.0894,
      gpsLng: parseFloat(farmGpsLng) || 73.7431,
      totalAreaAcres: parseFloat(farmAreaAcres) || 5.0,
      soilType: farmSoilType,
      waterSource: farmWaterSource,
      notes: farmNotes,
      createdAt: editingFarm ? editingFarm.createdAt : new Date().toISOString(),
      imageUrl: editingFarm?.imageUrl || '/src/assets/images/vineyard_canopy_hero_1793376498145.jpg',
    };

    onSaveFarm(farm);
    setIsFarmModalOpen(false);
  };

  // Open Plot Modal
  const openNewPlotModal = () => {
    setEditingPlot(null);
    setPlotName('');
    setPlotNumber(`Plot ${farmPlots.length + 1}`);
    setPlotAreaAcres('3.0');
    setPlotCropType('Grapes');
    setPlotVariety('Thompson Seedless');
    setPlotPlantingDate(new Date().toISOString().slice(0, 10));
    setPlotGrowthStage('Fruit Set');
    setPlotRowCount('12');
    setPlotRowSpacing('2.75');
    setPlotCanopyInstalled(true);
    setPlotNotes('');
    setIsPlotModalOpen(true);
  };

  const openEditPlotModal = (plot: Plot) => {
    setEditingPlot(plot);
    setPlotName(plot.name);
    setPlotNumber(plot.plotNumber);
    setPlotAreaAcres(plot.areaAcres.toString());
    setPlotCropType(plot.cropType);
    setPlotVariety(plot.cropVariety);
    setPlotPlantingDate(plot.plantingDate);
    setPlotGrowthStage(plot.growthStage);
    setPlotRowCount(plot.rowCount.toString());
    setPlotRowSpacing(plot.rowSpacingMeters.toString());
    setPlotCanopyInstalled(plot.canopyInstalled);
    setPlotNotes(plot.notes || '');
    setIsPlotModalOpen(true);
  };

  const handleSavePlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim() || !activeFarm) return;

    const plot: Plot = {
      id: editingPlot ? editingPlot.id : `plot-${Date.now()}`,
      farmId: activeFarm.id,
      name: plotName.trim(),
      plotNumber: plotNumber.trim(),
      areaAcres: parseFloat(plotAreaAcres) || 1.0,
      cropType: plotCropType,
      cropVariety: plotVariety.trim(),
      plantingDate: plotPlantingDate,
      growthStage: plotGrowthStage,
      rowCount: parseInt(plotRowCount, 10) || 8,
      rowSpacingMeters: parseFloat(plotRowSpacing) || 2.75,
      canopyInstalled: plotCanopyInstalled,
      canopySystemId: plotCanopyInstalled
        ? editingPlot?.canopySystemId || `canopy-sys-${Date.now()}`
        : undefined,
      notes: plotNotes,
    };

    onSavePlot(plot);
    setIsPlotModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Agricultural Asset Hierarchy
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500">
                Farm → Plot → Crop → Row → Canopy Section
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <Trees className="w-6 h-6 text-emerald-800" />
              <span>Farm & Crop Management</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Manage multi-farm landholdings, plot crop varieties, vineyard trellis rows, and overhead canopy installations.
            </p>
          </div>

          {/* Sub-Tabs: My Farms, My Plots, Crop & Row Management */}
          <div className="grid grid-cols-3 sm:flex items-center p-1 bg-stone-100 rounded-xl text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('farms')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg font-medium transition-colors text-center truncate ${
                activeSubTab === 'farms'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Farms ({farms.length})
            </button>
            <button
              onClick={() => setActiveSubTab('plots')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg font-medium transition-colors text-center truncate ${
                activeSubTab === 'plots'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Plots ({farmPlots.length})
            </button>
            <button
              onClick={() => setActiveSubTab('rows')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg font-medium transition-colors text-center truncate ${
                activeSubTab === 'rows'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Crop & Rows
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: MY FARMS */}
      {activeSubTab === 'farms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Registered Farms ({farms.length})
            </h2>
            <button
              onClick={openNewFarmModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Farm</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {farms.map((farm) => {
              const isSelected = farm.id === activeFarm?.id;
              const farmPlotsList = plots.filter((p) => p.farmId === farm.id);
              const protectedPlotsCount = farmPlotsList.filter((p) => p.canopyInstalled).length;

              return (
                <div
                  key={farm.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-2xs transition-all ${
                    isSelected ? 'border-emerald-700 ring-2 ring-emerald-700/10' : 'border-stone-200'
                  }`}
                >
                  {/* Farm Image Banner */}
                  <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                    <img
                      src={farm.imageUrl || '/src/assets/images/vineyard_canopy_hero_1793376498145.jpg'}
                      alt={farm.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                        {farm.totalAreaAcres} Acres
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active Farm
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Farm Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-stone-900">{farm.name}</h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{farm.location}, {farm.taluka}, {farm.district}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditFarmModal(farm)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          title="Edit Farm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {farms.length > 1 && (
                          <button
                            onClick={() => onDeleteFarm(farm.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Farm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                      <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-semibold">
                          Soil Classification
                        </span>
                        <span className="font-medium text-stone-800 truncate block">
                          {farm.soilType}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-semibold">
                          Water Infrastructure
                        </span>
                        <span className="font-medium text-stone-800 truncate block">
                          {farm.waterSource}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500">
                        Plots: <strong className="text-stone-800">{farmPlotsList.length}</strong> ({protectedPlotsCount} with HailShield)
                      </span>
                      {!isSelected && (
                        <button
                          onClick={() => onSelectFarm(farm.id)}
                          className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
                        >
                          <span>Select as Active Farm</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MY PLOTS */}
      {activeSubTab === 'plots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Plots on {activeFarm?.name} ({farmPlots.length})
              </h2>
              <p className="text-xs text-stone-500">
                Cultivated blocks with grape varieties, planting dates, and growth stages
              </p>
            </div>
            <button
              onClick={openNewPlotModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmPlots.map((plot) => {
              const plotRowsList = rows.filter((r) => r.plotId === plot.id);
              const growthStages = [
                'Dormant',
                'Bud Break',
                'Flowering',
                'Fruit Set',
                'Veraison',
                'Ripening',
                'Harvest',
              ];
              const stageIndex = growthStages.indexOf(plot.growthStage);
              const stagePercent = Math.round(((stageIndex + 1) / growthStages.length) * 100);

              return (
                <div
                  key={plot.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {plot.plotNumber}
                        </span>
                        <h3 className="text-sm font-extrabold text-stone-900 mt-1">
                          {plot.name}
                        </h3>
                        <p className="text-xs text-emerald-800 font-semibold">
                          {plot.cropType} • {plot.cropVariety}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditPlotModal(plot)}
                          className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePlot(plot.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Growth Stage Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                        <span>Growth Stage</span>
                        <strong className="text-stone-800">{plot.growthStage}</strong>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full"
                          style={{ width: `${stagePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Plot Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100 text-stone-600">
                      <div>
                        <span className="block text-[10px] text-stone-400 uppercase">Cultivated Area</span>
                        <span className="font-semibold text-stone-900">{plot.areaAcres} Acres</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-400 uppercase">Trellis Rows</span>
                        <span className="font-semibold text-stone-900">
                          {plot.rowCount} Rows ({plot.rowSpacingMeters}m gap)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Canopy Protection Status Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    {plot.canopyInstalled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        HailShield Canopy Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-500">
                        <ShieldX className="w-4 h-4 text-stone-400" />
                        Open Canopy (No Netting)
                      </span>
                    )}

                    {onNavigateToCanopy && plot.canopyInstalled && (
                      <button
                        onClick={() => onNavigateToCanopy(plot.id)}
                        className="text-emerald-800 hover:text-emerald-950 font-bold text-[11px] flex items-center gap-0.5"
                      >
                        <span>Control</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {farmPlots.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
              No plots registered for {activeFarm?.name}. Click "Add New Plot" to define your first cultivation block.
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: CROP & ROW MANAGEMENT */}
      {activeSubTab === 'rows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Crop & Trellis Row Management
              </h2>
              <p className="text-xs text-stone-500">
                Longitudinal crop row layout, Y-trellis spacing, and motorized canopy section groupings
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 text-xs">
              <span className="font-semibold text-stone-800">
                Active Farm: <strong>{activeFarm?.name}</strong>
              </span>
              <span className="text-stone-500">
                Standard Maharashtra Trellis: 2.75m row spacing (9 ft Y-Frame)
              </span>
            </div>

            {/* List plots and their rows */}
            <div className="space-y-6">
              {farmPlots.map((plot) => {
                const plotRowsList = rows.filter((r) => r.plotId === plot.id);
                const plotSecs = allSections.filter((s) => s.plotId === plot.id);

                return (
                  <div key={plot.id} className="p-4 rounded-xl bg-[#f8faf7] border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">
                          {plot.name} ({plot.plotNumber})
                        </h3>
                        <p className="text-xs text-stone-500">
                          {plot.cropType} • {plot.cropVariety} • {plot.rowCount} Crop Rows
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {plotSecs.length} Canopy Section(s)
                      </span>
                    </div>

                    {/* Parallel Sections Summary */}
                    {plotSecs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {plotSecs.map((sec) => (
                          <div
                            key={sec.id}
                            className="bg-white p-3 rounded-lg border border-stone-200 text-xs"
                          >
                            <div className="font-bold text-stone-900">{sec.name}</div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Rows {sec.assignedRowNumbers.join(', ')} • {sec.lengthMeters}m length
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px]">
                              <span className="text-stone-600">Overhead Position:</span>
                              <strong className="text-emerald-800 tabular-nums">
                                {sec.positionPercent}%
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500">
                        No overhead canopy sections configured for this plot.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FARM MODAL (Add/Edit) */}
      {isFarmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setIsFarmModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingFarm ? 'Edit Farm Details' : 'Register New Farm'}
              </h3>
              <button
                onClick={() => setIsFarmModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFarmSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Sahyadri Valley Vineyard"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Taluka</label>
                  <input
                    type="text"
                    required
                    value={farmTaluka}
                    onChange={(e) => setFarmTaluka(e.target.value)}
                    placeholder="Dindori"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={farmDistrict}
                    onChange={(e) => setFarmDistrict(e.target.value)}
                    placeholder="Nashik"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Village / Location</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="Near Gangapur Dam Backwaters"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={farmAreaAcres}
                    onChange={(e) => setFarmAreaAcres(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GPS Lat</label>
                  <input
                    type="text"
                    value={farmGpsLat}
                    onChange={(e) => setFarmGpsLat(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GPS Lng</label>
                  <input
                    type="text"
                    value={farmGpsLng}
                    onChange={(e) => setFarmGpsLng(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Soil Classification</label>
                <input
                  type="text"
                  value={farmSoilType}
                  onChange={(e) => setFarmSoilType(e.target.value)}
                  placeholder="Black Basaltic Clay Loam"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Water Infrastructure</label>
                <input
                  type="text"
                  value={farmWaterSource}
                  onChange={(e) => setFarmWaterSource(e.target.value)}
                  placeholder="Drip irrigation from farm pond"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFarmModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-xs"
                >
                  {editingFarm ? 'Update Farm' : 'Save Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLOT MODAL (Add/Edit) */}
      {isPlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setIsPlotModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingPlot ? 'Edit Plot Details' : `Add Plot to ${activeFarm?.name}`}
              </h3>
              <button
                onClick={() => setIsPlotModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlotSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Plot Identifier</label>
                  <input
                    type="text"
                    required
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    placeholder="Plot 1A"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Plot Name</label>
                  <input
                    type="text"
                    required
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    placeholder="North Block – Thompson"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Type</label>
                  <select
                    value={plotCropType}
                    onChange={(e) => setPlotCropType(e.target.value as CropType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Grapes">Grapes (द्राक्ष)</option>
                    <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Capsicum">Capsicum (शिमला मिरची)</option>
                    <option value="Guava">Guava (पेरू)</option>
                    <option value="Other">Other Horticultural Crop</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={plotVariety}
                    onChange={(e) => setPlotVariety(e.target.value)}
                    placeholder="Thompson Seedless / Super Bhagwa"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={plotAreaAcres}
                    onChange={(e) => setPlotAreaAcres(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Row Count</label>
                  <input
                    type="number"
                    required
                    value={plotRowCount}
                    onChange={(e) => setPlotRowCount(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Spacing (Meters)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={plotRowSpacing}
                    onChange={(e) => setPlotRowSpacing(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Growth Stage</label>
                  <select
                    value={plotGrowthStage}
                    onChange={(e) => setPlotGrowthStage(e.target.value as Plot['growthStage'])}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Dormant">Dormant</option>
                    <option value="Bud Break">Bud Break</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruit Set">Fruit Set</option>
                    <option value="Veraison">Veraison</option>
                    <option value="Ripening">Ripening</option>
                    <option value="Harvest">Harvest</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={plotPlantingDate}
                    onChange={(e) => setPlotPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="canopyInstalledCheck"
                  checked={plotCanopyInstalled}
                  onChange={(e) => setPlotCanopyInstalled(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
                />
                <label htmlFor="canopyInstalledCheck" className="font-semibold text-stone-800 cursor-pointer">
                  HailShield Motorized Canopy Installed on this Plot
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-xs"
                >
                  {editingPlot ? 'Update Plot' : 'Save Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

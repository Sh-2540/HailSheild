/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveWeatherData } from '../types';

// WMO Weather interpretation codes (WW)
const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains / Ice pellets',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function fetchLiveWeather(
  lat = 20.0894,
  lng = 73.7431,
  locationName = 'Dindori, Nashik (Maharashtra)'
): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API responded with status ${response.status}`);
    }
    const data = await response.json();

    const current = data.current || {};
    const daily = data.daily || {};

    const tempC = current.temperature_2m ?? 28.5;
    const humidity = current.relative_humidity_2m ?? 54;
    const windSpeed = current.wind_speed_10m ?? 12.0;
    const windDir = current.wind_direction_10m ?? 240;
    const rainMm = current.precipitation ?? 0.0;
    const weatherCode = current.weather_code ?? 1;

    // Daily forecast parsing
    const forecastDaily = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const dateStr = daily.time[i];
        const d = new Date(dateStr);
        const dayName = i === 0 ? 'Today' : DAY_NAMES[d.getDay()];
        const code = daily.weather_code?.[i] ?? 0;
        forecastDaily.push({
          date: dateStr,
          dayName,
          tempMaxC: daily.temperature_2m_max?.[i] ?? 31,
          tempMinC: daily.temperature_2m_min?.[i] ?? 19,
          rainProbabilityPercent: daily.precipitation_probability_max?.[i] ?? 10,
          precipitationMm: daily.precipitation_sum?.[i] ?? 0,
          windSpeedMaxKmh: daily.wind_speed_10m_max?.[i] ?? 16,
          weatherCode: code,
          conditionText: WMO_CODES[code] || 'Clear',
        });
      }
    }

    const rainProbability = forecastDaily[0]?.rainProbabilityPercent ?? 15;

    // Calculate Hail Risk Score based on convective meteorological flags
    let hailRiskScore: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (weatherCode === 96 || weatherCode === 99) {
      hailRiskScore = 'CRITICAL';
    } else if (weatherCode === 95 || (rainProbability > 65 && windSpeed > 28)) {
      hailRiskScore = 'HIGH';
    } else if (rainProbability > 40 || windSpeed > 22) {
      hailRiskScore = 'MODERATE';
    }

    return {
      temperatureC: Math.round(tempC * 10) / 10,
      humidityPercent: Math.round(humidity),
      windSpeedKmh: Math.round(windSpeed * 10) / 10,
      windDirectionDeg: Math.round(windDir),
      rainMm: Math.round(rainMm * 10) / 10,
      rainProbabilityPercent: rainProbability,
      weatherCode,
      weatherDescription: WMO_CODES[weatherCode] || 'Clear sky',
      uvIndex: 7.2,
      hailRiskScore,
      locationName,
      latitude: lat,
      longitude: lng,
      lastUpdated: new Date().toISOString(),
      isLiveApi: true,
      forecastDaily,
    };
  } catch (error) {
    console.warn('Weather API fetch failed, using realistic meteorology fallback:', error);
    return getFallbackWeatherData(lat, lng, locationName);
  }
}

function getFallbackWeatherData(lat: number, lng: number, locationName: string): LiveWeatherData {
  return {
    temperatureC: 29.2,
    humidityPercent: 51,
    windSpeedKmh: 14.5,
    windDirectionDeg: 235,
    rainMm: 0.0,
    rainProbabilityPercent: 20,
    weatherCode: 2,
    weatherDescription: 'Partly cloudy (Convective Watch)',
    uvIndex: 7.5,
    hailRiskScore: 'MODERATE',
    locationName,
    latitude: lat,
    longitude: lng,
    lastUpdated: new Date().toISOString(),
    isLiveApi: false,
    forecastDaily: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempMaxC: 31.8,
        tempMinC: 18.5,
        rainProbabilityPercent: 20,
        precipitationMm: 0.0,
        windSpeedMaxKmh: 18.0,
        weatherCode: 2,
        conditionText: 'Partly cloudy',
      },
      {
        date: '2026-10-31',
        dayName: 'Sat',
        tempMaxC: 32.2,
        tempMinC: 19.1,
        rainProbabilityPercent: 45,
        precipitationMm: 2.4,
        windSpeedMaxKmh: 24.5,
        weatherCode: 80,
        conditionText: 'Slight rain showers',
      },
      {
        date: '2026-11-01',
        dayName: 'Sun',
        tempMaxC: 30.5,
        tempMinC: 18.0,
        rainProbabilityPercent: 65,
        precipitationMm: 12.0,
        windSpeedMaxKmh: 31.0,
        weatherCode: 95,
        conditionText: 'Thunderstorm watch',
      },
      {
        date: '2026-11-02',
        dayName: 'Mon',
        tempMaxC: 28.0,
        tempMinC: 17.5,
        rainProbabilityPercent: 30,
        precipitationMm: 1.0,
        windSpeedMaxKmh: 15.0,
        weatherCode: 1,
        conditionText: 'Mainly clear',
      },
      {
        date: '2026-11-03',
        dayName: 'Tue',
        tempMaxC: 30.0,
        tempMinC: 18.0,
        rainProbabilityPercent: 10,
        precipitationMm: 0.0,
        windSpeedMaxKmh: 12.0,
        weatherCode: 0,
        conditionText: 'Clear sky',
      },
    ],
  };
}

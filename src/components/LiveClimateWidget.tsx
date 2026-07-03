/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  Wind, 
  Droplets, 
  Thermometer, 
  RefreshCw, 
  AlertCircle, 
  Info,
  Clock
} from 'lucide-react';
import { WeatherData } from '../types';

export const LiveClimateWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchWeather = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    setError(null);
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error('Could not fetch latest climate data from server');
      }
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to weather service');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (iconName: string) => {
    const classProps = "w-7 h-7 text-amber-600";
    switch (iconName) {
      case 'clear':
        return <Sun className={`${classProps} animate-spin-slow`} />;
      case 'rain':
        return <CloudRain className={`${classProps} animate-bounce`} />;
      case 'mist':
        return <CloudFog className={classProps} />;
      case 'cloud':
      default:
        return <Cloud className={classProps} />;
    }
  };

  // Convert Celsius to Fahrenheit for completeness
  const toFahrenheit = (celsius: number) => {
    return ((celsius * 9) / 5 + 32).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex flex-col items-center justify-center py-8 space-y-3">
        <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
        <span className="font-mono text-[10px] text-amber-800 uppercase tracking-widest font-bold">
          Consulting Brass Estuary Telemetry...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/5 border border-red-500/15 p-4 rounded-2xl space-y-3 text-left">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-display font-bold text-xs text-red-900">Climate Feed Interrupted</h5>
            <p className="font-sans text-[11px] text-red-700 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchWeather()}
          className="w-full py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Retry Connection
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl space-y-4 text-left relative overflow-hidden shadow-3xs">
      {/* Absolute top glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />

      {/* Title block with refresh action */}
      <div className="flex items-center justify-between border-b border-amber-500/10 pb-2 relative z-10">
        <span className="font-mono text-[9px] font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5" /> Live Brass Climate
        </span>
        <button
          onClick={() => fetchWeather(true)}
          disabled={isRefreshing}
          className="p-1 rounded-md text-amber-700 hover:bg-amber-500/10 transition-colors cursor-pointer"
          title="Refresh current climate"
          id="btn-refresh-climate"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Temperature and icon row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-black text-stone-900 leading-none">
              {weather.temp}°C
            </span>
            <span className="font-sans text-xs text-stone-400 font-medium">
              / {toFahrenheit(weather.temp)}°F
            </span>
          </div>
          <p className="font-sans text-2xs font-semibold text-stone-700 leading-tight">
            {weather.condition}
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-3xs border border-amber-500/10 shrink-0">
          {getWeatherIcon(weather.icon)}
        </div>
      </div>

      {/* Secondary weather attributes Grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <div className="bg-white/60 p-2 rounded-xl border border-stone-200/50 flex items-center gap-2">
          <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <div className="min-w-0">
            <span className="block font-mono text-[8px] text-stone-400 font-bold uppercase leading-none">Humidity</span>
            <span className="font-sans text-2xs font-bold text-stone-800 leading-none mt-1 block">
              {weather.humidity}%
            </span>
          </div>
        </div>
        
        <div className="bg-white/60 p-2 rounded-xl border border-stone-200/50 flex items-center gap-2">
          <Wind className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <div className="min-w-0">
            <span className="block font-mono text-[8px] text-stone-400 font-bold uppercase leading-none">Wind</span>
            <span className="font-sans text-2xs font-bold text-stone-800 leading-none mt-1 block truncate">
              {weather.windSpeed} m/s {weather.windDirection}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration status notice or footer */}
      <div className="space-y-1.5 relative z-10">
        {weather.isDemo ? (
          <div className="bg-amber-600/5 border border-amber-500/15 p-2 rounded-xl flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-sans text-[10px] text-stone-600 leading-normal">
              <strong className="text-amber-800">Demo Mode:</strong> Configure <code className="px-1 py-0.5 bg-amber-500/10 rounded font-mono text-[9px] text-amber-900 font-semibold">OPENWEATHER_API_KEY</code> in settings to unlock live Atlantic station feeds.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-600/5 border border-emerald-500/15 p-2 rounded-xl flex items-start gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1.5 shrink-0" />
            <p className="font-sans text-[10px] text-stone-600 leading-normal">
              Connected to live weather station at <strong className="text-emerald-800">Brass District Estuary</strong>.
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 font-mono text-[8px] text-stone-400">
          <Clock className="w-3 h-3" />
          <span>Last polled: {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

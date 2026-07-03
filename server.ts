/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// API Route: Live Climate for Brass Island, Nigeria
// Coordinates for Brass Island: Lat 4.3167° N, Lon 6.2333° E
app.get('/api/weather', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey || apiKey === 'MY_OPENWEATHER_API_KEY') {
    // Elegant fallback/demo data with natural fluctuations based on the current hour of the day
    const hour = new Date().getHours();
    
    // Simulate tropical Niger Delta climate temperatures (typically 24°C at night to 31°C in afternoon)
    let temp = 27.5;
    let condition = 'Partly Cloudy';
    let humidity = 85;
    let windSpeed = 3.6;
    let icon = 'cloud';

    if (hour >= 6 && hour < 11) {
      temp = 25.8 + Math.random();
      condition = 'Tropical Mist';
      humidity = 92;
      windSpeed = 2.4;
      icon = 'mist';
    } else if (hour >= 11 && hour < 16) {
      temp = 30.2 + Math.random() * 1.5;
      condition = 'Sunny / Humid';
      humidity = 76;
      windSpeed = 4.8;
      icon = 'clear';
    } else if (hour >= 16 && hour < 19) {
      temp = 28.1 + Math.random();
      condition = 'Overcast / Coastal Breeze';
      humidity = 82;
      windSpeed = 5.2;
      icon = 'cloud';
    } else {
      temp = 24.5 + Math.random() * 0.8;
      condition = 'Heavy Showers';
      humidity = 95;
      windSpeed = 3.1;
      icon = 'rain';
    }

    return res.json({
      temp: parseFloat(temp.toFixed(1)),
      condition,
      humidity,
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      windDirection: 'SW',
      icon,
      isDemo: true,
      lastUpdated: new Date().toISOString(),
      location: 'Brass Island, Nigeria'
    });
  }

  try {
    const lat = '4.3167';
    const lon = '6.2333';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse weather code into clean categories for our UI
    const weatherId = data.weather[0]?.id;
    let icon = 'cloud';
    if (weatherId >= 200 && weatherId < 600) {
      icon = 'rain';
    } else if (weatherId >= 600 && weatherId < 700) {
      icon = 'snow';
    } else if (weatherId >= 700 && weatherId < 800) {
      icon = 'mist';
    } else if (weatherId === 800) {
      icon = 'clear';
    }

    return res.json({
      temp: parseFloat(data.main?.temp?.toFixed(1) || '28.0'),
      condition: data.weather[0]?.main || 'Humid',
      humidity: data.main?.humidity || 80,
      windSpeed: parseFloat(data.wind?.speed?.toFixed(1) || '3.5'),
      windDirection: data.wind?.deg ? getWindDirection(data.wind.deg) : 'SW',
      icon,
      isDemo: false,
      lastUpdated: new Date().toISOString(),
      location: data.name || 'Brass Island, Nigeria'
    });
  } catch (err: any) {
    console.error('Weather API fetch failed, serving elegant fallback:', err.message);
    return res.json({
      temp: 27.8,
      condition: 'Humid Coastal Clouds',
      humidity: 83,
      windSpeed: 4.0,
      windDirection: 'SSW',
      icon: 'cloud',
      isDemo: true,
      error: err.message,
      lastUpdated: new Date().toISOString(),
      location: 'Brass Island, Nigeria'
    });
  }
});

// Helper to calculate wind direction cardinal strings
function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16;
  return directions[index];
}

// Vite integration
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();

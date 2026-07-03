/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FestivalItem {
  id: string;
  name: string;
  nativeName?: string;
  season: string;
  description: string;
  significance: string;
  activities: string[];
  imagePrompt: string;
  imageFallback: string;
}

export interface HistoricalEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  impact: string;
  visualIcon: string;
}

export interface DynastyRuler {
  id: string;
  title: string;
  name: string;
  reign: string;
  description: string;
  contribution: string;
}

export interface CulinaryItem {
  id: string;
  name: string;
  translation?: string;
  description: string;
  ingredients: { name: string; required: boolean; icon: string; description: string }[];
  steps: string[];
  funFact: string;
  imagePrompt: string;
  imageFallback: string;
}

export interface AttractionItem {
  id: string;
  name: string;
  type: 'beach' | 'heritage' | 'nature' | 'landmark';
  description: string;
  whyVisit: string;
  etiquette: string[];
  imagePrompt: string;
  imageFallback: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PostcardTemplate {
  id: string;
  name: string;
  themeClass: string;
  bgGradient: string;
  imageUrl: string;
  cardTitle: string;
  tagline: string;
}

export interface MuseumArtifact {
  id: string;
  name: string;
  era: string;
  material: string;
  description: string;
  history: string;
  dimensions?: string;
  imagePrompt: string;
  imageFallback: string;
  audioGuideText: string;
}


export type SpiceLevel = 'None' | 'Mild' | 'Medium' | 'Hot' | 'Fire';

export interface Chapter {
  id: string;
  name: string;
  tone: [string, string];
}

export interface Meal {
  id: number;
  chapter: string;
  chapterName: string;
  title: string;
  descriptors: string[];
  time: string;
  price: number;
  spice: SpiceLevel;
  serves: number;
}

export interface Cookbook {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  price: number;
  tone: [string, string];
}

export interface CartItem {
  title: string;
  price: number;
  qty: number;
  chapter: string;
  spice?: string;
  extraSauce?: boolean;
}

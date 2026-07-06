import type { Chapter, Cookbook, Meal } from '../types';

export const CHAPTERS: Chapter[] = [
  { id: 'skillet', name: 'Skillet Kings', tone: ['#E07539', '#CB4A1D'] },
  { id: 'fire', name: 'Flavor Bombs & Fire', tone: ['#D8912B', '#B23A2E'] },
  { id: 'roux', name: 'Roux & Risotto', tone: ['#9FAD66', '#62732A'] },
  { id: 'darkness', name: 'Soul Food After Dark', tone: ['#4A3B2A', '#241C14'] },
  { id: 'sweet', name: 'Sunday Sweet Tooth', tone: ['#ED9A63', '#D8912B'] },
  { id: 'grind', name: 'Rise & Grind', tone: ['#C1CB93', '#7C8D40'] },
];

export const MEALS: Meal[] = [
  { id: 1, chapter: 'skillet', chapterName: 'Skillet Kings', title: 'Seared Steak Pasta', descriptors: ['Seared', 'Creamy', 'Umami-Rich'], time: '1 hr', price: 24, spice: 'Mild', serves: 2 },
  { id: 2, chapter: 'skillet', chapterName: 'Skillet Kings', title: 'Cast Iron Smash Burgers', descriptors: ['Griddle-Pressed', 'Juicy', 'Sharp Cheddar'], time: '35 min', price: 16, spice: 'Mild', serves: 2 },
  { id: 3, chapter: 'fire', chapterName: 'Flavor Bombs & Fire', title: 'Hot Honey Fried Chicken Bites', descriptors: ['Crispy', 'Sweet Heat', 'Hand-Torn'], time: '45 min', price: 18, spice: 'Hot', serves: 3 },
  { id: 4, chapter: 'fire', chapterName: 'Flavor Bombs & Fire', title: 'Nashville Hot Chicken Tenders', descriptors: ['Fiery', 'Buttermilk-Brined', 'Pickle-Topped'], time: '50 min', price: 19, spice: 'Fire', serves: 2 },
  { id: 5, chapter: 'roux', chapterName: 'Roux & Risotto', title: 'Cajun Shrimp Risotto', descriptors: ['Blackened', 'Creamy', 'Parmesan-Finished'], time: '55 min', price: 26, spice: 'Medium', serves: 2 },
  { id: 6, chapter: 'darkness', chapterName: 'Soul Food After Dark', title: 'Braised Oxtails with Pan Gravy', descriptors: ['Fork-Tender', 'Rich', 'Slow-Braised'], time: '3 hr', price: 32, spice: 'Mild', serves: 4 },
  { id: 7, chapter: 'darkness', chapterName: 'Soul Food After Dark', title: 'Chicken & Waffles with Hot Honey Butter', descriptors: ['Crispy', 'Sweet-Savory', 'Buttermilk'], time: '1 hr', price: 21, spice: 'Mild', serves: 2 },
  { id: 8, chapter: 'sweet', chapterName: 'Sunday Sweet Tooth', title: 'Sweet Potato Cake', descriptors: ['Maple Glaze', 'Spiced', 'Sunday-Best'], time: '1.5 hr', price: 14, spice: 'None', serves: 6 },
  { id: 9, chapter: 'grind', chapterName: 'Rise & Grind', title: 'Steak & Egg Breakfast Skillet', descriptors: ['Crispy Potatoes', 'Runny Yolks', 'Protein-Heavy'], time: '30 min', price: 17, spice: 'Mild', serves: 2 },
];

export const COOKBOOKS: Cookbook[] = [
  { id: 'vol1', title: 'Volume One', subtitle: 'Cookbook', tag: 'Made with Heart, Served with Flair', price: 28, tone: ['#E07539', '#CB4A1D'] },
  { id: 'vol2', title: 'Volume Two', subtitle: 'Precision', tag: 'The water bath does the math, the cast iron does the flair.', price: 32, tone: ['#9FAD66', '#62732A'] },
];

export function chapterTone(id: string): [string, string] {
  return CHAPTERS.find((c) => c.id === id)?.tone ?? ['#E07539', '#CB4A1D'];
}

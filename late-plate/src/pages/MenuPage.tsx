import { useState } from 'react';
import { Hero } from '../components/storefront/Hero';
import { ChapterFilters } from '../components/storefront/ChapterFilters';
import { MealGrid } from '../components/storefront/MealGrid';
import { MealDetail } from '../components/storefront/MealDetail';
import { MEALS } from '../data/menu';
import type { Meal } from '../types';
import { useCart } from '../context/CartContext';

export function MenuPage() {
  const [chapter, setChapter] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { addItem } = useCart();

  const filteredMeals = chapter === 'all' ? MEALS : MEALS.filter((m) => m.chapter === chapter);

  return (
    <>
      <Hero />
      <div id="menu">
        <ChapterFilters active={chapter} onSelect={setChapter} />
        <MealGrid meals={filteredMeals} onSelect={setSelectedMeal} />
      </div>
      {selectedMeal && (
        <MealDetail
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onAdd={(item) => {
            addItem(item);
            setSelectedMeal(null);
          }}
        />
      )}
    </>
  );
}

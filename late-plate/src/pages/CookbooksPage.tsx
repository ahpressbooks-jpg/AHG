import { CookbookShop } from '../components/storefront/CookbookShop';
import { useCart } from '../context/CartContext';
import type { Cookbook } from '../types';

export function CookbooksPage() {
  const { addItem } = useCart();

  function buyCookbook(book: Cookbook) {
    addItem({ title: `Cookbook — ${book.title}`, price: book.price, qty: 1, chapter: 'darkness' });
  }

  return (
    <div style={{ paddingTop: 32 }}>
      <CookbookShop onBuy={buyCookbook} />
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';
import { Header } from './components/storefront/Header';
import { CartDrawer } from './components/storefront/CartDrawer';
import { MenuPage } from './pages/MenuPage';
import { CookbooksPage } from './pages/CookbooksPage';
import { AboutPage } from './pages/AboutPage';
import { useCart } from './context/CartContext';

function Toast() {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        background: 'var(--color-brand-secondary)',
        color: '#fff',
        padding: '12px 22px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
      }}
    >
      {toastMessage}
    </div>
  );
}

function CheckoutConfirmation() {
  const { checkoutDone, dismissCheckout } = useCart();
  if (!checkoutDone) return null;
  return (
    <div
      onClick={dismissCheckout}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(36,28,20,0.55)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          maxWidth: 380,
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: 'var(--lp-orange-600)' }}>
          Order Placed
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', margin: '12px 0 20px' }}>
          Your plate is on its way. Keep feeding people with heart — that&rsquo;s what makes it good.
        </p>
        <button
          onClick={dismissCheckout}
          style={{
            background: 'var(--color-brand-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '11px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh' }}>
      <Header />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cookbooks" element={<CookbooksPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <CartDrawer />
      <Toast />
      <CheckoutConfirmation />
    </div>
  );
}

export default App

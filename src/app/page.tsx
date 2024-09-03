// app/page.tsx
import Header from '@/components/Header';
import ProductCards from '@/components/ProductCards';

// Server Component
export default function Home() {
  return (
    <main>
      {/* Render server-side components */}
      <Header/>
      <ProductCards  />
    </main>
  );
}

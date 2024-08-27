// components/ProductCards.tsx
'use client';

import React, { useEffect } from 'react';
import { ProductCardC } from "./component/product-card-c";
import { Checkout } from "./component/checkout";
import { getProducts } from "@/app/actions";

interface ProductCardsProps {
  session: string;
}

const ProductCards: React.FC<ProductCardsProps>  = ({ session }) => {


  const [products, setProducts] = React.useState<{ id: number; name: string; description: string | null; price: number; stock: number; picture1: string | null; picture2: string | null; picture3: string | null; anime: string | null; createdAt: Date; }[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between px-12 my-10">
        {products.map((product: { id: number; name: string; description: string | null; price: number; stock: number; picture1: string | null; picture2: string | null; picture3: string | null; anime: string | null; createdAt: Date; }) => (
          <ProductCardC
            key={product.id}
            img={product.picture1 ?? ''}
            title={product.name}
            description={product.description ?? ''}
            price={product.price}
            className="my-6"
            id={product.id}
          />
        ))}
      </div>
      <Checkout />
    </>
  );
};

export default ProductCards;

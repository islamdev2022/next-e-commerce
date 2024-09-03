// components/ProductCards.tsx
'use client';

import React, { useEffect,useState } from 'react';
import { ProductCardC } from "./component/product-card-c";
import { getProducts } from "@/app/actions";
import { v4 as uuidv4 } from 'uuid';
interface ProductCardsProps {
}

const ProductCards: React.FC<ProductCardsProps>  = () => {

  const [SessionId, setSessionId] = useState("");

  useEffect(() => {
    // This will run only on the client side
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('sessionId', newSessionId);
    }
  }, []); 
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
      <div className="flex flex-wrap items-center justify-center sm:justify-around px-6 sm:px-12 my-10">
        {products.map((product: { id: number; name: string; description: string | null; price: number; stock: number; picture1: string | null; picture2: string | null; picture3: string | null; anime: string | null; createdAt: Date; }) => (
          <ProductCardC
            sessionId={SessionId}
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
    </>
  );
};

export default ProductCards;

// components/ProductCards.tsx
'use client';

import React, { useEffect } from 'react';
import { ProductCardC } from "./component/product-card-c";
import { Checkout } from "./component/checkout";
import { getProducts } from "@/app/actions";
import { useSession } from "@/context/sessionContext";

interface ProductCardsProps {
  session: string;
}

const ProductCards: React.FC<ProductCardsProps>  = async ({ session }) => {
  const { sessionId, setSessionId } = useSession();

  // Correct use of useEffect to set sessionId
  useEffect(() => {
    if (session) {
      setSessionId(session); // This should trigger a re-render with the new sessionId
    }
  }, [session, setSessionId]);

  // Log sessionId when it changes
  useEffect(() => {
    console.log("Updated sessionId state:", sessionId);
  }, [sessionId]);

  // Fetch products (assumed to be synchronous for now)
  const products = getProducts(); // If this is async, handle differently (e.g., in a useEffect)

  console.log("Session prop:", session); // Logs the incoming session prop correctly
  console.log("Session state:", sessionId); // Logs the sessionId state correctly

  return (
    <>
      <div className="flex flex-wrap items-center justify-between px-12 my-10">
        {(await products).map((product: { id: number; name: string; description: string | null; price: number; stock: number; picture1: string | null; picture2: string | null; picture3: string | null; anime: string | null; createdAt: Date; }) => (
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

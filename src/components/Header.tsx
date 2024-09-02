"use client";
import React, { useState, useEffect } from 'react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { Cart } from './component/cart';
import { getProducts } from "@/app/actions";
import Link from 'next/link';

const Header = ({ sessionId }: { sessionId: any }) => {
  // State for storing products fetched from the server
  const [products, setProducts] = useState<{ id: number; name: string; description: string | null; price: number; stock: number; picture1: string | null; picture2: string | null; picture3: string | null; anime: string | null; createdAt: Date; }[]>([]);
  
  // State for storing the search input and the filtered products
  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    // Fetch products from the server
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);  // Initialize with all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search input
    if (searchInput.trim() === '') {
      setFilteredProducts([]); // Set filteredProducts to an empty array if search input is empty
    } else {
    const results = products.filter(product =>
      (product.name?.toLowerCase().includes(searchInput.toLowerCase()) || 
      product.anime?.toLowerCase().includes(searchInput.toLowerCase()))
    );
    setFilteredProducts(results);
  }
  }, [searchInput, products]);

  return (
    <>
      <div className='flex mt-6 justify-between gap-2 px-3 sm:px-10 w-full sticky top-0 pb-5 bg-white shadow-xl  z-10'>
        <Link href="/" className='relative top-4 h-fit'>
          <img src="/assets/next.svg" alt="Logo" className=' object-cover w-20' />
        </Link>
        <div className='w-2/3'>
          <PlaceholdersAndVanishInput
          placeholders={["Dragon Ball", "One Piece", "Attack On Titan"]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}  // Update search input on change
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}  // Prevent default form submission
        />      <div className="">
        {filteredProducts.length > 0 || !searchInput ? (
          <ul className=" mx-auto table overflow-scroll w-full">
            {filteredProducts.map((product) => (
              <li key={product.id} className="py-2 border-b    w-full">
                <Link href={`/product/${product.id}`} className="items-center  flex justify-between w-full" >
                <h3 className="font-bold">{product.name}</h3>
                <p className='text-xs text-gray-600'>{product.anime}</p>
                <img src={product.picture1 ?? ''} alt="" className='w-6'/>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center">No products found.</p>
        )}
      </div>
        </div>
        
        <Cart SessionId={sessionId}></Cart>
      </div>
      
      {/* Render the filtered products below the header */}

    </>
  );
};

export default Header;

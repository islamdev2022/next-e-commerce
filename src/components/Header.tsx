"use client";
import React, { useState, useEffect } from 'react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { Cart } from './component/cart';
import { getProducts } from "@/app/actions";
import Link from 'next/link';
import Image from 'next/image';
const Header = () => {

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
      <div className='flex  justify-between gap-2 px-3 sm:px-10 w-full sticky top-0 py-3 bg-white shadow-xl  z-10 rounded-xl'>
        <Link href="/" className='relative top-4 h-fit'>
          <Image src="/assets/next.svg" alt="Logo" className=' object-cover w-20' width={500} height={300} />
        </Link>
        <div className='w-2/3'>
          <PlaceholdersAndVanishInput
          placeholders={["Dragon Ball", "One Piece", "Attack On Titan"]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}  // Update search input on change
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}  // Prevent default form submission
        />      <div className="">
        {filteredProducts.length > 0 || !searchInput ? (
          <ul className=" mx-auto table overflow-scroll w-full bg-gray-50 px-5  rounded-2xl">
            {filteredProducts.map((product) => (
              <li key={product.id} className="py-2 border-b hover:bg-gray-100   w-full">
                <Link href={`/product/${product.id}`} className="items-center  flex justify-between w-full" >
                <h3 className="font-bold">{product.name}</h3>
                <p className='text-xs text-gray-600'>{product.anime}</p>
                <Image src={product.picture1 ?? ''} alt={product.name} className='w-6 object-contain' width={500} height={300}/>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center">No products found.</p>
        )}
      </div>
        </div>
        
        <Cart/>
      </div>
      
      {/* Render the filtered products below the header */}

    </>
  );
};

export default Header;

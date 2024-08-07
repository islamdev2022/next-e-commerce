// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import { ProductDescription } from '@/components/component/product-description';

interface Product {
  id: string;
  img: string;
  title: string;
  description: string;
  price: number;
}

interface Props {
  product: Product;
}

const FAKE_PRODUCTS: Product[] = [
    {
        img: "/assets/placeholder.svg",
        title: "Product 1",
        description: "Description for Product 1",
        price: 1000,
        
        id: "1"
      },
      {
        img: "/assets/placeholder.svg",
        title: "Product 2",
        description: "Description for Product 2",
        price: 2000,
       
        id: "2"
      },
      {
        img: "/assets/placeholder.svg",
        title: "Product 3",
        description: "Description for Product 3",
        price: 3000,
        id: "3"
      },
      {
        img: "/assets/placeholder.svg",
        title: "Product 4",
        description: "Description for Product 4",
        price: 4000,
        id: "4"
      },
      {
        img: "/assets/placeholder.svg",
        title: "Product 5",
        description: "Description for Product 5",
        price: 5000,
        id: "5"
      }
];

interface Params extends ParsedUrlQuery {
  id: string;
}

export async function generateStaticParams() {
    return FAKE_PRODUCTS.map(product => ({
      id: product.id,
    }));
  }
  
  async function getProduct(id: string) {
    const product = FAKE_PRODUCTS.find((product) => product.id === id);
    return product || null;
  }
  
  export default async function Page({ params }: { params: Params }) {
    const product = await getProduct(params.id);
  
    if (!product) {
      notFound();
    }
  
    return (
    
    <div className='flex flex-col justify-center h-[90vh]'>
        <ProductDescription product={product} />
    </div>
    
)
  }
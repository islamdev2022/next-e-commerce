// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import { ProductDescription } from '@/components/component/product-description';
import { getProduct } from '@/app/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
  
  export default async function Page({ params }: { params: Params }) {

    const product = await getProduct(params.id);
  console.log("product")
    if (!product) {
      notFound();
    }
    const details = {
      id: product.id.toString(),
      picture1: product.picture1!,
      picture2: product.picture2!,
      picture3: product.picture3!,
      title: product.name!,
      description: product.description!,
      price: product.price!,
      stock: product.stock!,
      anime: product.anime!,
    };
    
  
    return (
    
    <div className='flex flex-col justify-center h-[90vh]'>
        <ProductDescription product={details} />
    </div>
    
)
  }
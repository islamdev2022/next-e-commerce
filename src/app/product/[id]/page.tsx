// app/product/[id]/page.tsx
import { ProductDescription } from '@/components/component/product-description';
import { getProduct } from '@/app/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
export default async function Page({ params }: { params: Params }) {

    const product = await getProduct(params.id);
  console.log("product" , product);

    const details = {
      id: Number(product?.id) ?? '',
      picture1: product?.picture1 ?? '',
      picture2: product?.picture2 ?? '',
      picture3: product?.picture3 ?? '',
      title: product?.name ?? '',
      description: product?.description ?? '',
      price: Number(product?.price) ?? 0,
      stock: product?.stock ?? '',
      anime: product?.anime ?? '',
    };
    
    const cookieStore = cookies()
  console.log("cookies");
  const posthogCookie = cookieStore.get('ph_phc_JHXDEpCWQRLpHDZe6tMJdo4lVl62hy1P8n13cvMcqDU_posthog');

if (posthogCookie && posthogCookie.value) {
  // Step 2: Parse the JSON string
  const posthogData = JSON.parse(posthogCookie.value);

  // Step 3: Access the session ID from the `$sesid` array
  const sessionId = posthogData?.$sesid?.[1];

  console.log('Session ID:', sessionId);
  
    return (
    
    <div className='flex flex-col justify-center h-[90vh]'>
        <ProductDescription product={details}  sessionId={sessionId}/>
    </div>
    
)
}
  }
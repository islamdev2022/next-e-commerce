import { PrismaClient } from '@prisma/client'
import { ProductsTable } from '@/components/component/products-table';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
const prisma = new PrismaClient();
const  dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("api/auth/signin");
  }
    const products = await prisma.product.findMany();

    products.map((product) => {
      console.log(product)
    })
    return ( 
    <>
    <div className="flex flex-wrap items-center justify-between px-12 my-10">

          <ProductsTable products={products}
          />

        </div>

    
    </> );
}
 
export default dashboard;
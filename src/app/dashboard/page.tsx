import { PrismaClient } from '@prisma/client'
import { ProductsTable } from '@/components/component/products-table';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SignOutBtn } from '@/components/SignOutBtn';
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
    <SignOutBtn />
    <h1 className="text-3xl font-semibold my-10 text-center">Dashboard ({session?.user?.name})</h1>
    <div className="flex flex-wrap items-center justify-between px-12 my-10">

          <ProductsTable products={products}
          />

        </div>

    
    </> );
}
 
export default dashboard;
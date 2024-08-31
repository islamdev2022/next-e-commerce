import { PrismaClient } from '@prisma/client'
import { ProductsTable } from '@/components/component/products-table';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SignOutBtn } from '@/components/SignOutBtn';
import OrdersTable from '@/components/component/OrdersTable';
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

    
    const allorders = await prisma.order.findMany({});


    allorders.map((order) => {
      console.log(order)
    })
    return ( 
    <>
    <div className='flex items-center justify-center gap-6'>
      <h1 className="text-3xl font-semibold my-10 text-center">Dashboard ({session?.user?.name})</h1>
    <SignOutBtn />
    </div>
    
    <div className="flex flex-wrap items-center justify-between sm:px-12 my-10">

          <ProductsTable products={products}
          />
          <OrdersTable />
        </div>

    
    </> );
}
 
export default dashboard;
import { PrismaClient } from '@prisma/client'
import { ProductCardC } from '@/components/component/product-card-c';
import { ProductsTable } from '@/components/component/products-table';
const prisma = new PrismaClient();
const  dashboard = async () => {
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
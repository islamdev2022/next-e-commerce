import { ProductCardC } from "./component/product-card-c";
import { ProductDescription } from "./component/product-description";
import { Checkout } from "./component/checkout";
import { getProducts } from "@/app/actions";

const ProductCards = async () => {
  const products = getProducts();
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
      ))}</div>
  <Checkout />
  

  </> );
}
 
export default ProductCards;
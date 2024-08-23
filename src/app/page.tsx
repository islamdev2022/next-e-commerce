import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Header from "@/components/Header";
import ProductCards from "@/components/ProductCards";
export default function Home() {
  return (
    <main className="">
      {/* <AuroraBackground> */}
       
                
        <ProductCards></ProductCards>
      {/* </AuroraBackground> */}
    </main>
  );
}

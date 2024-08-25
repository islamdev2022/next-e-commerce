import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Header from "@/components/Header";
import ProductCards from "@/components/ProductCards";
import { getServerSession } from "next-auth";

export default async function Home() {
const session = await getServerSession();
  console.log("sessionsddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
  console.log(session?.user?.name);
  console.log(process.env.AUTH_USERNAME)
  console.log(process.env.AUTH_PASSWORD)
  return (
    <main className="">
      {/* <AuroraBackground> */}
       
                
        <ProductCards></ProductCards>
      {/* </AuroraBackground> */}
    </main>
  );
}

import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Header from "@/components/Header";
import ProductCards from "@/components/ProductCards";
import { getServerSession } from "next-auth";
import { cookies } from 'next/headers'
export default async function Home() {

const session = await getServerSession();
  if (session){
    console.log(session?.user?.name);
  }else{
    console.log("no session");
  }
  
  const cookieStore = cookies()
  const posthogCookie = cookieStore.get('ph_phc_JHXDEpCWQRLpHDZe6tMJdo4lVl62hy1P8n13cvMcqDU_posthog');

if (posthogCookie && posthogCookie.value) {
  // Step 2: Parse the JSON string
  const posthogData = JSON.parse(posthogCookie.value);

  // Step 3: Access the session ID from the `$sesid` array
  const sessionId = posthogData?.$sesid?.[1];

  console.log('Session ID:', sessionId);
  return (
    <main className="">
      {/* <AuroraBackground> */}
      <Header sessionId={sessionId} />
                
        <ProductCards session={sessionId}></ProductCards>
      {/* </AuroraBackground> */}
    </main>
  );
} else {
  console.log('Session ID not found');
}
  
}

import { Checkout } from "@/components/component/checkout"
import { cookies } from "next/headers";
export default function CheckoutPage() {

  const cookieStore = cookies()
  const posthogCookie = cookieStore.get('ph_phc_JHXDEpCWQRLpHDZe6tMJdo4lVl62hy1P8n13cvMcqDU_posthog');

if (posthogCookie && posthogCookie.value) {
  // Step 2: Parse the JSON string
  const posthogData = JSON.parse(posthogCookie.value);

  // Step 3: Access the session ID from the `$sesid` array
  const sessionId = posthogData?.$sesid?.[1];

  return (
 
  <div>
  <Checkout SessionId={sessionId} />
  </div>
 )
}
}

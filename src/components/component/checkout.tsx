/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/l5GB7XchB3u
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'
import { Chivo } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

chivo({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import wilayas from '@/wilayas.json';
import { useToast } from "../ui/use-toast";
import { getCart } from "@/app/actions";
import { useRouter } from "next/navigation";
export function Checkout({SessionId}: {SessionId: string}) {
  interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
const router = useRouter();
const [seconds, setSeconds] = useState<number>(2); // State for countdown
  const [showMessage, setShowMessage] = useState<boolean>(false); // State for showing the redirection message

  // State to manage form inputs and product details
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    wilaya: '',
    commune: '',
    address: "",
    phone: "",
    shippingMethod: "",
    productDetails: [] as Product[],
    total: 0,  // Add total to formState
  });
  
  const [loading, setLoading] = useState(false); // Loading state
  // Shipping cost
  const shipping = 500;

  // Calculate subtotal
  const subtotal = formState.productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Calculate total
  const total = subtotal + shipping;

  const searchParams = useSearchParams();

  useEffect(() => {
    const items = searchParams.get("items");
    if (items) {
      try {
        const decodedProductDetails = decodeURIComponent(items);
        const parsedProductDetails = JSON.parse(decodedProductDetails);
        setFormState((prevState) => ({
          ...prevState,
          productDetails: parsedProductDetails,
          total: parsedProductDetails.reduce((acc: number, item: Product) => acc + item.price * item.quantity, 0) + shipping,
        }));
      } catch (error) {
        console.error("Error parsing product details:", error);
      }
    }
  }, [searchParams]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Update total whenever product details change
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      total: subtotal + shipping,
    }));
  }, [subtotal]);

  const { toast } = useToast()
  const handleCreate = async () => {
    setLoading(true); // Start loading
    try {
      // Create the order first
      const orderResponse = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalPrice: formState.total,
          destination: `${formState.address} ${formState.commune} ${formState.wilaya}`,
          name: formState.fullName,
          email: formState.email,
          phone: formState.phone,
        }),
      });
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(`Failed to create order: ${errorData.error || "Unknown error"}`);
      }
  
      // Capture the order ID from the response
      const orderData = await orderResponse.json();
    const orderId = orderData.orderId; // Ensure this is correct
      toast({
        title: "Order created successfully!",
      });
  
      // Now, create order items for each product
      for (const product of formState.productDetails) {
        const orderItemResponse = await fetch("/api/orderItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            orderId: orderId, // Use the orderId from the created order
            quantity: product.quantity,
          }),
        });
  
        if (!orderItemResponse.ok) {
          const errorData = await orderItemResponse.json();
          toast({
            title: `Order item creation failed: ${errorData.error || "Unknown error"}`,
          });
          throw new Error(`Failed to create order item for product ${product.name}: ${errorData.error || "Unknown error"}`);
        }
  
        toast({
          title: "Order item created successfully!",
        });
      }

      // Now, delete the cart items
      const deleteCartItemsResponse = await fetch("/api/cartItem", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cartId,
        }),
      });
      if (!deleteCartItemsResponse.ok) {
        const errorData = await deleteCartItemsResponse.json();
        throw new Error(`Failed to delete cart items: ${errorData.error || "Unknown error"}`);
      }
      
      toast({
        title: "Your order was successfully sent!",
      });
  
    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: `Order creation failed `,
        description: `${error as string}`,
      });
    } finally{
      setLoading(false); // Stop loading
      // Show redirection message
      setShowMessage(true);

      // Start countdown
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            router.push("/"); // Replace with your target route
          }
          return prevSeconds - 1;
        });
      }, 1000);
    
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };
  
  // to delete the cart item once the order completed I should : 
  // get the sessionID
  // 1- get the cart ID using session Id 
  // 2- get the cart items using the cart ID
  // 3- minus the quantity of the product from the product table using the cart items table (productId)
  // 4- delete the cart items
  const [cartId, setCartId] = useState(0);
  useEffect(() => {
    // Fetch cart data when the component mounts
    const fetchCart = async () => {
      try {
        const cart1 = await getCart(SessionId);
        if (cart1 && cart1.length > 0) {
          const cartId = cart1[0].id;
          setCartId(cartId);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [SessionId]); // Dependency array: runs when SessionId changes


  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formState.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Phone Number</Label>
              <Input
              id="phone"
              type="number"
              typeof="tel"
                placeholder="213 ........."
                value={formState.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formState.email}
              onChange={handleInputChange}
            />
          </div>

          

          {/* Wilaya and Commune Selection */}
          <div className="space-y-2">
  <Label htmlFor="wilaya">Wilaya</Label>
  <Select
    value={formState.wilaya}
    onValueChange={(value) =>
      setFormState((prevState) => ({
        ...prevState,
        wilaya: value,
        commune: "", // Reset commune when wilaya changes
      }))
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a Wilaya" />
    </SelectTrigger>
    <SelectContent>
      {wilayas.map((wilaya) => (
        <SelectItem key={wilaya.id} value={wilaya.name}>
          {wilaya.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

{formState.wilaya && (
  <div className="space-y-2">
    <Label htmlFor="commune">Commune</Label>
    <Select
      value={formState.commune}
      onValueChange={(value) =>
        setFormState((prevState) => ({
          ...prevState,
          commune: value,
        }))
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a Commune" />
      </SelectTrigger>
      <SelectContent>
        {wilayas
          .find((wilaya) => wilaya.name === formState.wilaya)
          ?.communes.map((commune) => (
            <SelectItem key={commune.id} value={commune.name}>
              {commune.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
)}
        <div className="space-y-2">
            <Label htmlFor="address">Destination Address</Label>
            <Textarea
              id="address"
              rows={3}
              placeholder="123 Main St, Anytown USA"
              value={formState.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingMethod">Shipping Method</Label>
            <Select
              value={formState.shippingMethod}
              onValueChange={(value) =>
                setFormState((prevState) => ({
                  ...prevState,
                  shippingMethod: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Delivery Company office</SelectItem>
                <SelectItem value="Home">Home Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>

          
        </form>
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
          </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>
        <Card>
          <CardHeader>
            <CardTitle>Items in Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formState.productDetails.map((item) => (
              <div key={item?.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.price.toFixed(2)} DA</p>
                  <p className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} DA</p>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator />
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <p>Subtotal</p>
              <p className="font-medium">{subtotal.toFixed(2)} DA</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Shipping</p>
              <p className="font-medium">{shipping.toFixed(2)} DA</p>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex items-center justify-between">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">{formState.total.toFixed(2)} DA</p>
          </CardFooter>
        </Card>
      </div>
    </div>
    {showMessage && (
        <div className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded">
          <p>You will be redirected in {seconds} seconds...</p>
        </div>
      )}
  </div>
  );
}

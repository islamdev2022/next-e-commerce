"use client"

import { JSX, SVGProps, useState,useEffect } from "react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCart } from "@/app/actions"
import { getCartItem } from "@/app/actions"
import { getProduct } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { v4 as uuidv4 } from 'uuid';
export function Cart() {
  const [SessionId, setSessionId] = useState("");

  useEffect(() => {
    // This will run only on the client side
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('sessionId', newSessionId);
    }
  }, []); 
  const [cartItem, setCartItem] = useState<{ id: number; cartId: number; productId: number; quantity: number; }[]>([]);
  const [cartId, setCartId] = useState(0);
  const { toast } = useToast()
  useEffect(() => {
    // Fetch cart data when the component mounts
    const fetchCart = async () => {
      try {
        const cart1 = await getCart(SessionId);
        if (cart1 && cart1.length > 0) {
          const cartId = cart1[0].id;
          setCartId(cartId);
        }else{
          try{
            const cartResponse = await fetch("/api/cart" , {
              method : "POST",
              headers:{
                "Content-Type" : "application/json",
              },
              body:JSON.stringify({
                SessionId:SessionId
              })
            })
            if(!cartResponse.ok){
              const errorData= await cartResponse.json()
              throw new Error(`failed to create Cart: ${errorData.error || "UnkownError"} ` )
            }
          }catch (error){
            console.error("cart creation failed", error)
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [SessionId]); // Dependency array: runs when SessionId changes

  useEffect(() => {
    // Function to fetch cart items
    const fetchCartItems = async () => {
      try {
        const items = await getCartItem(cartId);
        setCartItem(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems(); // Call the function to fetch cart items
  }, [cartId]);


const [productDetails , setProductDetails] = useState<{ id: number; name: string; price: number; stock: number; picture1: string | null; anime: string | null;quantity:number ; cartItem:number ; cartId:number}[]>([]);
useEffect(() => {
  // Function to fetch product details
  const fetchProducts = async () => {
    try {
      if (cartItem.length > 0) {
        // Create a map of productId to cart item details for later reference
        const cartItemMap = new Map(
          cartItem.map(item => [item.productId, { quantity: item.quantity, cartItemId: item.id }])
        );

        // Create an array of product IDs from cartItem
        const productIds = cartItem.map(item => item.productId);

        // Fetch product details for each productId
        const fetchPromises = productIds.map(id => getProduct(id));
        const products = await Promise.all(fetchPromises);

        // Combine product details with cart item details
        const combinedProductDetails = products.map(product => {
          const cartItemDetail = cartItemMap.get(product?.id ?? 0);
          return {
            id: product?.id ?? 0,
            name: product?.name ?? '',
            price: product?.price ?? 0,
            stock: product?.stock ?? 0,
            picture1: product?.picture1 ?? null,
            anime: product?.anime ?? null,
            quantity: cartItemDetail ? cartItemDetail.quantity : 0,
            cartItem: cartItemDetail ? cartItemDetail.cartItemId : 0,
            cartId: cartId
          };
        });

        // Update state with the combined product details
        setProductDetails(combinedProductDetails);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch products when cartItem changes
  fetchProducts();
}, [cartItem]); // Dependency array: runs when cartItem changes


const handleDelete = async (cartItemId : Number) => {
  try {
   
    const response = await fetch('/api/cartItem', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItemId }),
    });

    if (response.ok) {
      setProductDetails(productDetails.filter((item) => item.cartItem !== cartItemId))
      toast({
        title: "Item deleted from the cart succesfully",
      })
    } else {
      const errorData = await response.json(); // Fetch error details
      console.error("Failed to delete item from cart");
      toast({
        title: `Failed to delete item with id ${cartItemId} from cart`,
        description: errorData.error || "An unexpected error occurred", // Show error details if available
      });
    }
  } catch (error) {
    console.error('Error deleting Item:', error);
  }
};
const [quantityErrors, setQuantityErrors] = useState<{ [key: number]: string }>({});
const updateQuantity = (id: number, quantity: number) => {
  setProductDetails(
    productDetails.map((item) => {
      if (item.id === id) {
        if (quantity > item.stock) {
          setQuantityErrors((prevErrors) => ({
            ...prevErrors,
            [id]: `Quantity cannot exceed available stock of ${item.stock}`,
          }));
          return { ...item, quantity: item.stock }; // Limit to available stock
        } else {
          setQuantityErrors((prevErrors) => {
            const { [id]: _, ...rest } = prevErrors; // Remove the error for this item
            return rest;
          });
          return { ...item, quantity }; // Update with desired quantity
        }
      }
      return item; // No change for items with different ids
    })
  );
};


  const removeFromCart = (id: number) => {
    handleDelete(id);
    cartItem.length -= 1;
  }
  const total = productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Serialize the productDetails array
const serializedProductDetails = JSON.stringify(productDetails);
const encodedProductDetails = encodeURIComponent(serializedProductDetails);
  return (
    <Drawer>
      <DrawerTrigger className="flex flex-col relative bottom-2">
          <Badge className="bg-primary text-primary-foreground relative left-2 top-2">
            {cartItem.length}
          </Badge>
          <ShoppingCartIcon className="h-6 w-6" />
          
    </DrawerTrigger>
      <DrawerContent className="w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>Review and update the items in your cart.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto">
  {productDetails.length === 0 ? (
    <div className="p-4 text-center">
      <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
    </div>
  ) : (
    <div className="grid gap-4 p-4">
      {productDetails.map((item) => (
        <div key={item.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
          <Image
            src={item.picture1 ?? ""}
            alt={item.name}
            className="rounded-md object-contain w-16 h-16"
            width={500} height={300}
          />
          <div className="grid gap-1">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} DA</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity === 1}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{item.quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.cartItem)}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
          <p className="w-72 text-sm sm:w-80 text-red-600 font-semibold">{quantityErrors[item.id]}</p>
        </div>
      ))}
    </div>
  )}
</div>
        <DrawerFooter className="border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Total</span>
            <span className="text-lg font-medium">{total.toFixed(2)} DA</span>
          </div>
          <Link href={`/checkout?items=${encodedProductDetails}`}>
          <Button className="mt-4 w-full">Checkout</Button>
        </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function MinusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}


function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function ShoppingCartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


function Trash2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}



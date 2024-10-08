"use client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCart } from "@/app/actions"
import { useState,useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
export function ProductCardC({img, title, description, price ,className,id,sessionId}: {img: string, title: string, description: string, price: number,className:string,id:Number,sessionId:string}) {
  const [cartId, setCartId] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch cart data when the component mounts
    const fetchCart = async () => {
      try {
        const cart1 = await getCart(sessionId);
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
                sessionId:sessionId
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
  }, [sessionId]); // Dependency array: runs when SessionId changes

  const { toast } = useToast()
  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch("/api/cartItem", {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
        quantity: 1,
        cartId: cartId,
      }),
    });
    if (res.ok) {
      setLoading(false);
      toast({
        title: "Item Added to Cart succesfully",
      })
    } else {
      console.error("Failed to add item to cart");
      toast({
        title: "Item Already in Cart",
      })
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };
  return (
    <Card className={`w-72 h-fit max-w-sm overflow-hidden rounded-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl ${className} `}>
      <Link href={`/product/${id}`} className="block" >
        <Image
          src={img}
          alt="Product Image"
          width={500} height={300}
          className="h-[300px] w-full object-contain"
        />
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          <Link href={`/product/${id}`} className="block" >
            <h3 className="text-lg font-bold text-black">{title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground truncate">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{price}DZD</span>
          <Button variant="outline" size="sm"
            onClick={handleSubmit} disabled={loading}
          >
            {loading ? "Processing..." : "Add to cart" }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

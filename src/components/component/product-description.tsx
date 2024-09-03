"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps,useState,useEffect, SetStateAction } from "react"
import { getCart } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import ProductNotFound from "@/components/component/product-not-found"
import Header from "../Header"
import Image from "next/image"
import { v4 as uuidv4 } from 'uuid';
export function ProductDescription ({ product }: { product: { id: number, picture1: string, picture2: string, picture3: string ,  title: string, description: string, price: number, anime:string }}) {
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
  const [cartId, setCartId] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const { toast } = useToast()

  // Handle the change event to update the selected quantity
  const handleQuantityChange = (value: string) => {
    setSelectedQuantity(Number(value));
  };
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
  }, [SessionId]);

  const handleCreate = async () => {
    setLoading(true)
    const res = await fetch("/api/cartItem", {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        quantity:Number(selectedQuantity),
        cartId: cartId,
      }),
    });
    if (res.ok) {
      setLoading(false)
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
    if (!product) {
    return <ProductNotFound/>
  }
  if (product.title === '') {
    return <ProductNotFound/>
  }
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="max-w-6xl px-4 mx-auto py-6 space-y-8 flex justify-center items-center h-screen ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <div className="grid gap-4 md:gap-8">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {[product.picture1, product.picture2, product.picture3].map((picture, index) => (
                  <CarouselItem key={index}>
                    <div className="relative group">
                      <Image
                        src={picture}
                        width={600}
                        height={600}
                        alt={`Product Image ${index + 1}`}
                        className="aspect-square object-contain w-full rounded-lg overflow-hidden group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
          <div className="grid gap-4 md:gap-10 items-start">
            <div className="grid gap-2">
              <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < 5 ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
                  ))}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{product.price} DZD</div>
              </div>
              <div>
                <p className="font-semibold">{product.anime}</p>
              </div>
              <div>
                <p className="text-sm sm:text-base ">{product.description}</p>
              </div>
            </div>
            <form className="grid gap-4 md:gap-10">
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-base">
                  Quantity
                </Label>
                <Select value={selectedQuantity.toString()} onValueChange={handleQuantityChange}>
                  <SelectTrigger className="w-full sm:w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" onClick={handleSubmit} className="w-full sm:w-auto"disabled={loading}
          >
            {loading ? "Processing..." : "Add to cart" }
          </Button>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


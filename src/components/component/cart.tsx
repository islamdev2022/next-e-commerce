/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/xA6oAXPhHwV
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client"

import { JSX, SVGProps, useState } from "react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Cart() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Cozy Blanket",
      price: 29.99,
      quantity: 1,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Autumn Mug",
      price: 12.99,
      quantity: 2,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Fall Fragrance Candle",
      price: 16.99,
      quantity: 1,
      image: "/placeholder.svg",
    },
  ])
  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  return (
    <Drawer>
      <DrawerTrigger className="flex flex-col relative bottom-2">
          <Badge className="bg-primary text-primary-foreground relative left-2 top-2">
            {cart.length}
          </Badge>
          <ShoppingCartIcon className="h-6 w-6" />
          
    </DrawerTrigger>
      <DrawerContent className="w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>Review and update the items in your cart.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-4 p-4">
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
                <img
                  src="/placeholder.svg"
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="grid gap-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
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
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Total</span>
            <span className="text-lg font-medium">${total.toFixed(2)}</span>
          </div>
          <Button className="mt-4 w-full">Checkout</Button>
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


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

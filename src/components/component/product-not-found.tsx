import Link from 'next/link'
import { PackageSearch } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function ProductNotFound() {
  return (
    <div className=" mx-auto px-4 py-16 flex flex-col items-center text-center">
      <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">Product Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We&apos;re sorry, but the product you&apos;re looking for doesn&apos;t seem to exist or out of stock.
      </p>
      <div className="w-full max-w-md mb-8">
        <form className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search for products" />
          <Button type="submit">Search</Button>
        </form>
      </div>
      <Button asChild>
        <Link href="/">Browse All Products</Link>
      </Button>
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="w-full h-40 bg-muted rounded-md mb-4" />
                <h3 className="font-semibold mb-2">Featured Product {i}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a brief description of the featured product.
                </p>
                <Button variant="outline" asChild>
                  <Link href={`/products/${i}`}>View Product</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
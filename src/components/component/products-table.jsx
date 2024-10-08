"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "../ui/use-toast";
import Image from "next/image";
export function ProductsTable({ products: initialProducts }) {
  // State to manage products
  const [products, setProducts] = useState(initialProducts);

  // Introduce a state to manage stock values for each product
  const [stocks, setStocks] = useState(() => {
    const initialStocks = {};
    products.forEach(product => {
      initialStocks[product.id] = product.stock;
    });
    return initialStocks;
  });

  const handleDelete = async (id, imageUrls) => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        // Remove the deleted product from the state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        toast({
          title: 'Product deleted successfully',
          description: 'success',
        });
      } else {
        console.error('Failed to delete the product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditStock = async (id, stock) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id, stock }),
      });
      if (response.ok) {
        toast({
          title: 'Stock updated successfully',
          description: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };

  const handleStockChange = (id, newStock) => {
    setStocks(prevStocks => ({
      ...prevStocks,
      [id]: newStock,
    }));
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(filterText.toLowerCase()) ||
      product.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col h-full w-full">
      <header className="bg-muted/40 p-4 flex items-center justify-between">
        <p className="text-2xl font-bold">Products</p>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={filterText}
            onChange={handleFilter}
            className="bg-background px-4 py-2 rounded-md shadow-sm"
          />
          <Link href="/dashboard/AddNew" className="">
            <Button>
              Add New
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer">Img</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Name{" "}
                {sortColumn === "name" && (
                  <span className="text-muted-foreground">
                    {sortDirection === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                Description{" "}
                {sortColumn === "description" && (
                  <span className="text-muted-foreground">
                    {sortDirection === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                Price{" "}
                {sortColumn === "price" && (
                  <span className="text-muted-foreground">
                    {sortDirection === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
                Stock{" "}
                {sortColumn === "stock" && (
                  <span className="text-muted-foreground">
                    {sortDirection === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <Image width={500} height={300} src={product.picture1} alt="" className="w-10 h-10 object-contain" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price.toFixed(2)} DA</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={stocks[product.id]}
                    onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditStock(product.id, stocks[product.id])}
                    >
                      <FilePenIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(product.id, [product.picture1, product.picture2, product.picture3])}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilePenIcon(props) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props) {
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
    </svg>
  );
}

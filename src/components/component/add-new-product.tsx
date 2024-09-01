"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { set } from "date-fns";
interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  anime: string;
  picture1: File | null;
  picture2: File | null;
  picture3: File | null;
}

export default function AddNewProduct() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    anime: "",
    picture1: null,
    picture2: null,
    picture3: null,
  });
const [loading,setLoading] = useState(false)
  const { toast } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "test-e-commerce"); // Ensure this matches your Cloudinary upload preset
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Upload error details:", error); // Log the exact error message from Cloudinary
        throw new Error("Failed to upload image");
      }else{
        console.log('Image uploaded successfully');
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error during upload:", error); // Additional error logging
      throw error;
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Upload images to Cloudinary and get URLs
      const picture1Url = formData.picture1 ? await uploadImageToCloudinary(formData.picture1) : null;
      const picture2Url = formData.picture2 ? await uploadImageToCloudinary(formData.picture2) : null;
      const picture3Url = formData.picture3 ? await uploadImageToCloudinary(formData.picture3) : null;

      console.log(
        "Uploading images to Cloudinary:",
        picture1Url,
        picture2Url,
        picture3Url
      )

      // Create a new product with image URLs
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          picture1: picture1Url,
          picture2: picture2Url,
          picture3: picture3Url,
        }),
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        console.log('Product created:', newProduct);
        toast({
          title: 'Product created successfully',
        });
        setLoading(false);
      } else {
        console.error('Failed to create the product');
        toast({
          title: 'Failed to create the product',
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <Card className="w-full max-w-4xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter the details of your new product.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anime">Anime</Label>
              <Input id="anime" value={formData.anime} onChange={handleChange} placeholder="Enter Anime name" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Enter product description" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={formData.price} onChange={handleChange} placeholder="Enter price" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Enter stock quantity" />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="picture1">Image 1</Label>
                <Input id="picture1" type="file" onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="picture2">Image 2</Label>
                <Input id="picture2" type="file" onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="picture3">Image 3</Label>
                <Input id="picture3" type="file" onChange={handleChange} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" type="reset">Cancel</Button>
          <Button type="submit"disabled={loading}
          >
            {loading ? "Processing..." : "Add Product" }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
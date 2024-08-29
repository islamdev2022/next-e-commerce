import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    const orderItems = await prisma.orderItem.findMany();
    return NextResponse.json(orderItems);
}

export async function POST(req) {
    try {
      const { productId, orderId, quantity = 1 } = await req.json();
  
      // Log incoming request data for debugging
      console.log("Received data for creating order item:", { productId, orderId, quantity });
  
      if (!productId || !orderId) {
        console.error("Product ID or Order ID missing.");
        return NextResponse.json({ error: 'Product ID and Order ID are required.' }, { status: 400 });
      }
  
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        console.error("Product not found.");
        return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
      }
  
      if (product.stock < quantity) {
        console.error("Insufficient stock.");
        return NextResponse.json({ error: 'Insufficient stock.' }, { status: 400 });
      }
  
      const orderItem = await prisma.orderItem.create({
        data: {
          order: {
            connect: { id: orderId }
          },
          product: {
            connect: { id: productId }
          },
          quantity
        }
      });
  
      return NextResponse.json(orderItem, { status: 201 });
  
    } catch (error) {
      console.error('Error creating order item:', error);
      return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
  }
  
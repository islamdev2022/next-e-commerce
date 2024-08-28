import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    const order = await prisma.order.findMany();
    return NextResponse.json(order);
}

export async function POST(req){
    try {
        // Parse the request body
        const { totalPrice, destination, name, email, phone } = await req.json();
    
        // Input validation
        if (!totalPrice || !destination || !name || !email || !phone ) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
    
        // Create a new order in the database
        const newOrder = await prisma.order.create({
          data: {
            totalPrice,
            destination,
            Name: name, // Use 'Name' to match Prisma schema field
            Email: email, // Use 'Email' to match Prisma schema field
            Phone: phone, // Use 'Phone' to match Prisma schema field
            orderState: 'PENDING', // Default value (update as per your Prisma schema definition)
            updatedByAdminId: null, // Default value (update as per your Prisma schema definition)
            orderDate: new Date(), // Default value (update as per your Prisma schema definition)
            updatedAt: new Date(), // Default value (update as per your Prisma schema definition)
          },
        });
    
        return NextResponse.json(newOrder, { status: 201 });
      } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
    }
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    const order = await prisma.order.findMany();
    return NextResponse.json(order);
}

export async function POST(req) {
  try {
    const { totalPrice, destination, name, email, phone } = await req.json();

    if (!totalPrice || !destination || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new order in the database
    const newOrder = await prisma.order.create({
      data: {
        totalPrice,
        destination,
        Name: name,
        Email: email,
        Phone: phone,
        orderState: 'PENDING',
        updatedByAdminId: null,
        orderDate: new Date(),
        updatedAt: new Date(),
      },
    });

    // Return the new order's ID
    return NextResponse.json({ orderId: newOrder.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

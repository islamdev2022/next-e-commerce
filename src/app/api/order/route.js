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


export async function PUT(req) {
  try {
    const { orderId, orderState } = await req.json();

    // Validate input
    if (!orderId || !orderState) {
      return NextResponse.json(
        { error: 'orderId and orderState are required.' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Update the order state
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { orderState },
      });

      // If the new state is COMPLETED, update the stock for each product in the order
      if (orderState === 'COMPLETED') {
        // Fetch all order items associated with the order
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });

        for (const item of orderItems) {
          // Fetch the current stock of the product
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with id ${item.productId} not found.`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for product id ${item.productId}. Available: ${product.stock}, Required: ${item.quantity}`
            );
          }

          // Decrease the stock by the quantity ordered
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: product.stock - item.quantity },
          });
        }
      }

      return updatedOrder;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error('Error updating order state:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

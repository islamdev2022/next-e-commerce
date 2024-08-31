import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  
  try {
    const newCart = await prisma.cart.create({
      data: {
        sessionId: body.sessionId,
        // Only create cartItems if they exist in the request body
        ...(body.cartItems && body.cartItems.length > 0 && {
          cartItems: {
            create: body.cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }
        }),
      },
      include: {
        cartItems: true, // Include cartItems in the response if they were created
      },
    });
    return NextResponse.json(newCart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const Carts = await prisma.cart.findMany();
  return NextResponse.json(Carts);
  }

export async function DELETE(req) {
  const body = await req.json();
  try {
    const deletedCart = await prisma.cart.delete({
      where: { id: body.id },
    });
    return NextResponse.json(deletedCart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
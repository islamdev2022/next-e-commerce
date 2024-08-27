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

export async function GET(req) {
    const cookieStore = cookies()
    const posthogCookie = cookieStore.get('ph_phc_JHXDEpCWQRLpHDZe6tMJdo4lVl62hy1P8n13cvMcqDU_posthog');


    try {
        if (posthogCookie && posthogCookie.value) {
  // Step 2: Parse the JSON string
  const posthogData = JSON.parse(posthogCookie.value);

  // Step 3: Access the session ID from the `$sesid` array
  const sessionId = posthogData?.$sesid?.[1];    
  console.log(sessionId)
    // if (!sessionId) {
    //   return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    // }

      const cart = await prisma.cart.findFirst({
        where: { sessionId },
        // include: {
        //   cartItems: {
        //     include: {
        //       product: true, // Optionally include product details for each cart item
        //     },
        //   },
        // },
      });
 
      if (!cart) {
        return NextResponse.json({ error: 'Cart not found with this id' }, { status: 404 });
      }
   }
      return NextResponse.json(cart);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET () {
    const cartItems = await prisma.cartItem.findMany();
    return NextResponse.json(cartItems);
}

export async function POST(req) {
    try {
        // Parse the request body to get productId, cartId, and quantity
        const { productId, cartId, quantity = 1 } = await req.json(); // Assuming quantity is optional and defaults to 1
        
        // Validate input data
        if (!productId || !cartId) {
            return NextResponse.json({ error: 'Product ID and Cart ID are required.' }, { status: 400 });
        }

        // Check if the product exists and is available in stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock.' }, { status: 400 });
        }

        // Create a new CartItem
        const cartItem = await prisma.cartItem.create({
            data: {
                cart: {
                    connect: { id: cartId } // Connect existing cart
                },
                product: {
                    connect: { id: productId } // Connect existing product
                },
                quantity
            }
        });

        return NextResponse.json(cartItem, { status: 201 }); // Return created CartItem with status 201 Created

    } catch (error) {
        console.error('Error creating cart item:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        // Parse the request body
        const { cartItemId, cartId } = await req.json();

        if (cartItemId) {
            // If cartItemId is provided, delete the single CartItem
            const deletedCartItem = await prisma.cartItem.delete({
                where: { id: cartItemId },
            });
            return NextResponse.json(deletedCartItem, { status: 200 });
        } else if (cartId) {
            // If cartId is provided, delete all CartItems associated with that cartId
            const deleteResult = await prisma.cartItem.deleteMany({
                where: { cartId: cartId },
            });
            return NextResponse.json({ message: `${deleteResult.count} cart items deleted.` }, { status: 200 });
        } else {
            // If neither cartItemId nor cartId is provided, return an error
            return NextResponse.json({ error: 'Cart Item ID or Cart ID is required.' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error deleting cart item(s):', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

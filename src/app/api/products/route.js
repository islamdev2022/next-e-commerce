import {NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  
  // Parse price and stock to numbers
  const price = parseFloat(body.price);
  const stock = parseInt(body.stock, 10);

  console.log('Received data:', {
    ...body,
    price,
    stock,
  });

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: isNaN(price) ? 0 : price, // Handle case where price might not be a valid number
        stock: isNaN(stock) ? 0 : stock, // Handle case where stock might not be a valid number
        picture1: body.picture1,
        picture2: body.picture2,
        picture3: body.picture3,
        anime: body.anime,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error); // Log detailed error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function DELETE(req) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const product = await prisma.product.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}


export async function PUT(req) {
  try {
    // Parse the request body to get productId and new stock quantity
    const { productId, stock } = await req.json();
    
    // Validate input data
    if (typeof productId !== 'number' || typeof stock !== 'number' || stock < 0) {
        return NextResponse.json(
            { error: 'Invalid productId or stock quantity. Stock must be a non-negative integer.' },
            { status: 400 }
        );
    }

    // Update the product stock
    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stock },
    });

    // Return the updated product
    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}


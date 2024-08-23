import {NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const body = await req.json();
  
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: body.name,
          description: body.description,
          price: body.price ? parseFloat(body.price) : 0,
          stock: body.stock ? parseInt(body.stock, 10) : 0,
          picture1: body.picture1,
          picture2: body.picture2,
          picture3: body.picture3,
          category: body.category,
          sex: body.sex,
          size: body.size,
          color: body.color,
          brandName: body.brandName,
        },
      });
      return NextResponse.json(newProduct);
    } catch (error) {
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



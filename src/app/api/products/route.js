import {NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {

    let name = 'T-shirt2';
    let description = 'A T-shirt';
    let price = 1000;
    let stock = 10;
    let picture1 = '/assets/next.svg';
    let picture2 = '/assets/next.svg';
    let picture3 = '/assets/next.svg';
    let category = 'Clothing';
    let sex = 'male';
    let size = 'M';
    let color = 'black';
    let brandName = 'Nike';

    const NewProduct = await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            picture1,
            picture2,
            picture3,
            category,
            sex,
            size,
            color,
            brandName
        }
    })
    return NextResponse.json(NewProduct);
}

export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function DELETE() {
    const product = await prisma.product.delete({
        where: { id: Number(id) },
    })
    return NextResponse.json(product);
}
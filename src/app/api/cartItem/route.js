import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET () {
    const cartItems = await prisma.cartItem.findMany();
    return NextResponse.json(cartItems);
}
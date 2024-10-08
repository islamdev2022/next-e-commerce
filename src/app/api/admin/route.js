import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
    const admin = await prisma.admin.findMany();
    return NextResponse.json(admin);
}
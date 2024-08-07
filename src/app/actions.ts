import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

// export const createProduct = async (data: {
//     name: string;
//     description: string;
//     price: number;
//     stock: number;
//     picture1: string;
//     picture2: string;
//     picture3: string;
//     category: string;
//     }) => {
//     const product = await prisma.product.create({
//         data: {
//         name: data.name,
//         description: data.description,
//         price: data.price,
//         stock: data.stock,
//         picture1: data.picture1,
//         picture2: data.picture2,
//         picture3: data.picture3,
//         category: data.category,
//         },
//     });
//     return product;
//     }

export const deleteProduct = async (id: number) => {
    const Deleteproduct = await prisma.product.delete({
        where: {
        id: id,
        },
    });
    return new Response("delete product from cart")
    }
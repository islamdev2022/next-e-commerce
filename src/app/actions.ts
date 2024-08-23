import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};
export const getProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });
  return product;
};

export const AddProduct = async (req: { json: () => any; }) => {
  const body = await req.json();

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
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
    return newProduct;
  } catch (error) {
    return error;
  }
}


export const deleteProduct = async (id: number) => {
    const Deleteproduct = await prisma.product.delete({
        where: {
        id: id,
        },
    });
    return Deleteproduct;
    }
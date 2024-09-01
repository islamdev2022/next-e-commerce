"use server"
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

import crypto from 'crypto';

export const deleteImageFromCloudinary = async (publicId: string | Blob) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
 
  
  // Generate a signature for the request using Node's crypto module
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString  + apiSecret ).digest('hex');
  // console.log("Cloudinary Cloud Name:",cloudName);
  // console.log("Cloudinary API Key:", apiKey);
  // console.log("String to sign:", signatureString);
  // console.log("Generated signature:", signature);
  // console.log("Timestamp:", timestamp);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('signature', signature);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.result === 'ok') {
      console.log(`Image with public ID ${publicId} deleted successfully.`);
      return true;
    } else {
      console.error(`Failed to delete image from Cloudinary:`, result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

export const deleteProduct = async (id: number) => {
    const Deleteproduct = await prisma.product.delete({
        where: {
        id: id,
        },
    });
    return Deleteproduct;
    }

    export const updateProductStock = async(productId: number, quantity: number)=> {
      // Fetch the current stock of the product
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
    
      if (!product) {
        throw new Error(`Product with id ${productId} not found.`);
      }
    
      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product id ${productId}. Available: ${product.stock}, Required: ${quantity}`
        );
      }
    
      // Decrease the stock by the quantity ordered
      return await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity },
      });
    }

/////////////CART////////////////////////

export const getCart = async (sessionId: string) => {
  try {
    const cart = await prisma.cart.findMany({
    where: {
      sessionId: sessionId,
    },
  });
  return cart;
  } catch(error){
    console.error('no cart with this session ID')
    
  }
  
};

//////////////CART ITEM////////////////////

export const getCartItem = async (cartId: number) => {
  const cartItem = await prisma.cartItem.findMany({
    where: {
      cartId: cartId,
    },
  });
  return cartItem;
};


//////////////ORDERS////////////////////
export async function getOrders() {
  const order = await prisma.order.findMany();
  return order;
}

export async function getOrderItemsByOrderID(orderID: number) {
  try {
    const orderWithItems = await prisma.order.findUnique({
      where: {
        id: orderID,
      },
      include: {
        orderItems: true, // Include the orderItems associated with the order
      },
    });

    if (!orderWithItems) {
      throw new Error('Order not found');
    }

    return orderWithItems.orderItems;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
}
It's an e-commerce website that sells anime figures, built with Next.js 14 and Tailwind CSS. I used shadcn as component library with v0.dev ,  The backend is powered by MySQL with Prisma ORM, and the database is hosted on Railway, while images are stored on Cloudinary.

The website features a secure dashboard panel for admins, protected by authentication using NextAuth. This dashboard allows admins to view all products along with their stock and prices, add new products, modify stock levels, and manage orders by changing their states (PENDING, COMPLETED, CANCELED). Admins can also access detailed client information for each order.

Users can search for products by anime names or character names and view detailed information about each product. The cart functionality is robust, retaining items even if the user closes or refreshes the page, thanks to cart details and items being stored in the database. Users can order multiple items with different quantities at the same time, fill out a shipping form, and choose their Wilaya and Commune.

Additionally, I created API routes to handle all backend operations seamlessly, enabling dynamic interactions between the frontend and backend. Working on this project helped me gain a deeper understanding of backend development, including authentication, data management, and building a scalable application architecture.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

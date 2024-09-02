/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
              port: '',
              pathname: '/dhotw02xu/**',  // Match all paths under your Cloudinary folder
            },
          ],
      },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', '127.0.0.1', 'localhost', 'greenpact-latest.onrender.com'], // combine both here
  },
  output: 'standalone',
};

export default nextConfig;

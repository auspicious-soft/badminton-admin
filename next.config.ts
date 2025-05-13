// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// next.config.js
// /** @type {import('next').NextConfig} */
// const imageHostnames = process.env.NEXT_PUBLIC_AWS_BUCKET_PATH?.split(",") || [];
// const nextConfig = {
//   images: {
//     domains: imageHostnames,
//   },
//   webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
//     if (!isServer) {
//       config.resolve = config.resolve || {};
//       config.resolve.fallback = {
//         fs: false,
//         path: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
//     if (!isServer) {
//       config.resolve = config.resolve || {};
//       config.resolve.fallback = {
//         fs: false,
//         path: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'playpadelpickel.s3.eu-north-1.amazonaws.com',
//         pathname: '/**',
//       },
//     ],
//   },
//   webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
//     if (!isServer) {
//       config.resolve = config.resolve || {};
//       config.resolve.fallback = {
//         fs: false,
//         path: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.AWS_BUCKET_NAME ? `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` : '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output:'export',
  eslint: {
    // ✅ Ignore all ESLint errors during builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

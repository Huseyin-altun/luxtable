import { createMDX } from 'fumadocs-mdx/next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
  },
  turbopack: {
    root: path.join(__dirname, '../../'),
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/en/docs',
        permanent: false,
      },
      {
        source: '/docs/:path*',
        destination: '/en/docs/:path*',
        permanent: false,
      },
    ];
  },
};

export default withMDX(config);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'],
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
      // Ignore @sparticuz/chromium and puppeteer on client-side builds
      if (!isServer) {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@sparticuz/chromium': false,
          'puppeteer-core': false,
          'puppeteer': false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;
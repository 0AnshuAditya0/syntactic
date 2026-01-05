/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    // Prefer browser field so AlaSQL resolves to its browser bundle (no react-native deps).
    config.resolve.mainFields = ['browser', 'module', 'main'];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub out AlaSQL's filesystem plugin and react-native deps so they are not bundled for web
      'alasql/dist/alasql.fs.js': false,
      'alasql.fs.js': false,
      'react-native-fetch-blob': false,
      'react-native-fs': false,
      'react-native': false,
    };
    return config;
  },
}

module.exports = nextConfig

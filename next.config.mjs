/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  output: 'export',
  basePath: '/ukulele-song-transposer',
  assetPrefix: '/ukulele-song-transposer/',
  trailingSlash: true,
}

export default nextConfig
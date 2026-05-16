/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mig/modules-schema', '@mig/pricing-engine', '@mig/three-utils', 'three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr)$/i,
      type: 'asset/resource',
    })
    return config
  },
}

export default nextConfig

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
  output: 'standalone',
  // Configuración de proxy inverso para redireccionar las peticiones a través de la red Docker
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://songs-ms:3001/api/:path*',
      },
      // Ruta alternativa para evitar bloqueos por extensiones
      {
        source: '/_data/:path*',
        destination: 'http://songs-ms:3001/api/:path*',
      },
    ];
  },
}

export default nextConfig

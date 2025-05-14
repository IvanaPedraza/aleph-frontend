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
  // Configura el proxy para redirigir las peticiones API al microservicio usando IP directa
  async rewrites() {
    // Siempre usar la IP directa del backend
    const apiUrl = 'http://172.20.0.3:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      },
      {
        source: '/music/:path*',
        destination: `${apiUrl}/music/:path*`
      },
    ]
  },
}

export default nextConfig
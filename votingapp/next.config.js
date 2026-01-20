/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' http://127.0.0.1:8545 http://localhost:8545 ws://127.0.0.1:8545 ws://localhost:8545;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

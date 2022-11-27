/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    apiEndpoint: process.env.THETAPIZZA_API_ENDPOINT,
    gtmKey: process.env.GTM_KEY
  },
}
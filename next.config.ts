import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    contractOwnerAddress: process.env.CONTRACT_OWNER_ADDRESS,
    sepoliaAlchemyApiKey: process.env.SEPOLIA_ALCHEMY_API_KEY,
    PINATA_JWT: process.env.PINATA_JWT,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL  
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.mypinata.cloud',
      },
    ],
  }
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "42283df2-4ffd-4692-9e63-4b5b8afe261c"
});

export default withCivicAuth(nextConfig)

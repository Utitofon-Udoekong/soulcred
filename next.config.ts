import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    contractOwnerAddress: process.env.CONTRACT_OWNER_ADDRESS,
    sepoliaAlchemyApiKey: process.env.SEPOLIA_ALCHEMY_API_KEY,
    ipfsStorageKey: process.env.IPFS_STORAGE_KEY,
    ipfsStorageEmail: process.env.IPFS_STORAGE_EMAIL,
    ipfsStorageSpaceName: process.env.IPFS_STORAGE_SPACE_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ipfs.w3s.link',
      },
      {
        protocol: 'https',
        hostname: 'storyset.com',
      },
    ],
  }
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "42283df2-4ffd-4692-9e63-4b5b8afe261c"
});

export default withCivicAuth(nextConfig)

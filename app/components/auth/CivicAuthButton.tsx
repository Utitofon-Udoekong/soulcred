'use client';

import { useUser } from "@civic/auth-web3/react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { UserButton } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { useWeb3 } from "@/app/providers/Web3Provider";

export function CivicAuthButton() {
  const { user } = useUser();
  const { address: wagmiAddress } = useWeb3();
  const userContext = useUser();
  const address = userHasWallet(userContext) ? userContext.ethereum.address : wagmiAddress;
  console.log(user && address)
  // Otherwise, show the single action button
  return (
    <>
      {
        user && address ?
          (<div className="flex flex-col md:flex-row max-w-md gap-2 w-full mt-4">
            <Link
              href="/dashboard/organizations"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-center w-full"
            >
              View Organization
            </Link>
            <Link
              href="/dashboard/resume/create"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 text-center w-full"
            >
              Create Resume
            </Link>
          </div>) :
          <UserButton />
      }
    </>
  );
} 
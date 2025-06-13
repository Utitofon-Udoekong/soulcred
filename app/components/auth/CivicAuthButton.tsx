'use client';

import { UserButton } from "@civic/auth-web3/react";

export function CivicAuthButton() {
  return (
    <>
      {
        <UserButton className="rounded-xl px-4 bg-[#1978e5] !text-white hover:!text-black text-sm font-bold login-button" />
      }
    </>
  );
} 
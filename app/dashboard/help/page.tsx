"use client";

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#111418] mb-6">Help & Support</h1>
      <p className="text-[#637488] mb-8">
        Welcome to SoulCred Help! Here you can find answers to common questions, get support, and access documentation.
      </p>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-[#1978e5]">How do I create a new credential?</h3>
            <p className="text-[#637488]">Go to <Link href="/dashboard/credentials/create" className="text-[#1978e5] underline">Create Credential</Link> and fill out your resume details. You can save as draft or mint as an NFT.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">How do I verify my credentials?</h3>
            <p className="text-[#637488]">After adding a credential, request verification from an organization. Track requests in the <Link href="/dashboard/verification-requests" className="text-[#1978e5] underline">Verification</Link> tab.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">How do I burn (delete) a credential?</h3>
            <p className="text-[#637488]">On the <Link href="/dashboard/credentials" className="text-[#1978e5] underline">Credentials</Link> page, click the red <b>Burn</b> button on the credential you want to delete. This action is permanent.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">Where is my data stored?</h3>
            <p className="text-[#637488]">Your resume data is stored on IPFS via Web3.Storage, and credentials are minted as soulbound NFTs on-chain.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Contact & Support</h2>
        <p className="text-[#637488] mb-2">Need more help? Reach out to our team:</p>
        <ul className="list-disc list-inside text-[#637488]">
          <li>Email: <a href="mailto:support@soulcred.xyz" className="text-[#1978e5] underline">support@soulcred.xyz</a></li>
          <li>Twitter: <a href="https://twitter.com/soulcred_xyz" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] underline">@soulcred_xyz</a></li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Documentation</h2>
        <ul className="list-disc list-inside text-[#637488]">
          <li><a href="https://docs.soulcred.xyz" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] underline">SoulCred Docs</a></li>
          <li><a href="https://web3.storage/docs/" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] underline">Web3.Storage Docs</a></li>
        </ul>
      </div>
    </div>
  );
} 
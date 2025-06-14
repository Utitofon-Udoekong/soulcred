"use client";

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="px-4 py-10">
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
            <p className="text-[#637488]">Your resume data is stored on IPFS via Pinata, and credentials are minted as soulbound NFTs on-chain.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Organizations</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-[#1978e5]">What are organizations?</h3>
            <p className="text-[#637488]">Organizations are entities (such as companies, universities, or DAOs) that can verify credentials on SoulCred. Verified organizations can approve or reject verification requests for user credentials.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">How do I register an organization?</h3>
            <p className="text-[#637488]">Go to the <Link href="/dashboard/organizations" className="text-[#1978e5] underline">Organizations</Link> page and click &quot;Register Organization&quot;. Fill out your details and submit your request. An admin will review and approve your organization.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">How do organizations verify credentials?</h3>
            <p className="text-[#637488]">Once your organization is verified, you can view and manage verification requests from users. Approve or reject requests in the <Link href="/dashboard/verification-requests" className="text-[#1978e5] underline">Verification Requests</Link> page.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Admin</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-[#1978e5]">What can admins do?</h3>
            <p className="text-[#637488]">Admins manage the SoulCred platform, including reviewing and approving new organization registrations, managing existing organizations, and overseeing verification activity.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">How do admins approve organizations?</h3>
            <p className="text-[#637488]">Admins can view pending organization registrations in the admin dashboard. After reviewing the details, they can approve or reject the registration. Approved organizations can then verify user credentials.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#1978e5]">Admin best practices</h3>
            <p className="text-[#637488]">Admins should regularly monitor organization activity, respond promptly to registration requests, and ensure only legitimate organizations are approved to maintain trust in the SoulCred ecosystem.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Documentation</h2>
        <ul className="list-disc list-inside text-[#637488]">
          <li className="italic text-[#637488]">SoulCred Docs: <span className="text-[#1978e5]">Coming soon</span></li>
          <li><a href="https://docs.storacha.network" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] underline">Web3.Storage Docs</a></li>
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#111418] mb-3">Contact & Support</h2>
        <p className="text-[#637488] mb-2">Need more help? Reach out to our team:</p>
        <ul className="list-disc list-inside text-[#637488]">
          <li>Email: <a href="mailto:support@soulcred.xyz" className="text-[#1978e5] underline">support@soulcred.xyz</a></li>
          <li>Twitter: <a href="https://twitter.com/soulcred_xyz" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] underline">@soulcred_xyz</a></li>
        </ul>
      </div>
    </div>
  );
} 
"use client";

import { useState } from "react";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { useResumes } from '@/app/hooks/useResumes';
import { UserButton } from "@civic/auth-web3/react";
import Link from 'next/link';

export default function CredentialsPage() {
  const { 
    userAuthenticated, 
    walletConnected, 
    createWallet
  } = useWeb3();
  
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const { data: resumes = [], isLoading, error } = useResumes();

  // Filter resumes based on tab and search
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const hasVerifiedEntries = resume.entries?.some(entry => entry.verified) ?? false;
    const matchesTab = tab === "All" || (tab === "Verified" && hasVerifiedEntries);
    return matchesSearch && matchesTab;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1978e5]"></div>
        <p className="mt-4 text-[#637488]">Loading your credentials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#1978e5] hover:bg-[#1978e5]/90 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If not authenticated, show login button
  if (!userAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          <p className="text-[#637488] mb-6">
            Please sign in to view and manage your credentials.
          </p>
          <UserButton />
        </div>
      </div>
    );
  }

  // If wallet isn't connected, show create wallet button
  if (!walletConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Create a Wallet</h2>
          <p className="text-[#637488] mb-6">
            You need a wallet to use the credential features. Create one now to get started.
          </p>
          <button 
            onClick={() => createWallet()}
            className="bg-[#1978e5] hover:bg-[#1978e5]/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#111418]">My Credentials</h1>
        <Link
          href="/dashboard/credentials/create"
          className="bg-[#1978e5] hover:bg-[#1978e5]/90 text-white px-4 py-2 rounded-lg"
        >
          Create New Credential
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setTab("All")}
              className={`px-4 py-2 rounded-lg ${
                tab === "All"
                  ? "bg-[#1978e5] text-white"
                  : "bg-[#f0f2f4] text-[#111418] hover:bg-[#f0f2f4]/90"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab("Verified")}
              className={`px-4 py-2 rounded-lg ${
                tab === "Verified"
                  ? "bg-[#1978e5] text-white"
                  : "bg-[#f0f2f4] text-[#111418] hover:bg-[#f0f2f4]/90"
              }`}
            >
              Verified
            </button>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search credentials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
            />
          </div>
        </div>

        {filteredResumes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#637488]">No credentials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Link
                key={resume.tokenId}
                href={`/dashboard/credentials/${resume.tokenId}`}
                className="block bg-white border border-[#e5e7eb] rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#111418]">{resume.name}</h3>
                  {resume.entries?.some(entry => entry.verified) && (
                    <span className="px-2 py-1 bg-[#e6f4ea] text-[#1e7e34] text-xs font-medium rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[#637488] text-sm mb-4">{resume.profile.bio}</p>
                {resume.profile.skills && resume.profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resume.profile.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#f0f2f4] text-[#111418] text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {resume.profile.skills.length > 3 && (
                      <span className="px-2 py-1 bg-[#f0f2f4] text-[#111418] text-xs rounded">
                        +{resume.profile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
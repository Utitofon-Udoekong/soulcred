"use client";

import { useState } from "react";
import { UserButton } from "@civic/auth-web3/react";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { useVerificationRequests } from '@/app/hooks/useVerificationRequests';

const statusPill = (status: string) => {
  let color = "bg-[#f0f2f4] text-[#111418]";
  if (status === "Completed") color = "bg-green-100 text-green-700";
  if (status === "Pending") color = "bg-[#f0f2f4] text-[#111418]";
  return (
    <span className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 text-sm font-medium leading-normal w-full ${color}`}>
      <span className="truncate">{status}</span>
    </span>
  );
};

export default function RequestsPage() {
  const { 
    userAuthenticated, 
    walletConnected, 
    createWallet, 
  } = useWeb3();
  
  // Use the new hook for verification requests
  const { data: verificationRequests = [], isLoading: loading, error } = useVerificationRequests();
  const [filter, setFilter] = useState("All");
  // Filter real requests by status
  const filteredRequests =
    filter === "All"
      ? verificationRequests
      : verificationRequests.filter((r) =>
          filter === "Pending"
            ? r.status === "pending"
            : (r.status === "approved" || r.status === "rejected")
        );

  // Helper to shorten addresses
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your verification requests...</p>
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
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
          <p className="text-gray-600 mb-6">
            Please sign in to view and manage your verification requests.
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
          <p className="text-gray-600 mb-6">
            You need a wallet to use the verification features. Create one now to get started.
          </p>
          <button 
            onClick={() => createWallet()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto w-full flex flex-col min-h-screen">
      <div className="flex flex-col gap-2 px-4 pt-4">
        <h1 className="text-[#111418] text-3xl font-bold leading-tight">Requests</h1>
        <p className="text-[#637488] text-base font-normal leading-normal">Manage and track all your verification requests</p>
      </div>
      {/* Table */}
      <div className="px-4 py-6 flex-1">
        <div className="overflow-x-auto rounded-xl border border-[#dce0e5] bg-white">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Request ID</th>
                <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Message</th>
                <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Requester</th>
                <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Organization</th>
                <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal flex items-center gap-2">
                  Status
                  <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="ml-2 border border-[#dce0e5] rounded px-2 py-1 text-sm bg-white text-[#111418]"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left text-[#637488] w-60 text-sm font-medium leading-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#637488]">No requests found.</td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="border-t border-[#dce0e5]">
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637488] text-sm font-normal leading-normal">{r.id}</td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">{r.details}</td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637488] text-sm font-normal leading-normal">{shortenAddress(r.user)}</td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637488] text-sm font-normal leading-normal">{shortenAddress(r.organization)}</td>
                    <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">{statusPill(r.status === 'pending' ? 'Pending' : r.status === 'approved' ? 'Completed' : r.status === 'rejected' ? 'Rejected' : r.status)}</td>
                    <td className="h-[72px] px-4 py-2 w-60 text-[#637488] text-sm font-normal leading-normal">{new Date(r.timestamp * 1000).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Bottom left actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 pb-6">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1978e5] text-white text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">New Request</span>
        </button>
        <a href="#" className="flex items-center gap-2 text-[#637488] text-sm font-medium leading-normal hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>
          Help and docs
        </a>
      </div>
    </div>
  );
} 
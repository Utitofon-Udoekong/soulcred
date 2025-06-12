"use client";

import Image from "next/image";
import { useVerificationRequests } from "@/app/hooks/useVerificationRequests";

export default function DashboardPage() {
  // Fetch verification requests
  const { data: verificationRequests = [], isLoading, error } = useVerificationRequests();

  // Compute stats
  const totalCredentials = verificationRequests.length;
  const verifiedCredentials = verificationRequests.filter(r => r.status === 'approved').length;
  const pendingCredentials = verificationRequests.filter(r => r.status === 'pending').length;

  // Recent activity: show up to 5 most recent requests
  const recentActivity = verificationRequests
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((r) => {
      let icon, desc;
      if (r.status === 'approved') {
        icon = (
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
        );
        desc = "Verified successfully";
      } else if (r.status === 'pending') {
        icon = (
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
        );
        desc = "Verification in progress";
      } else {
        icon = (
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        );
        desc = "Verification failed";
      }
      return {
        icon,
        title: r.details || `Credential: ${r.id}`,
        desc,
      };
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-[#637488] text-lg">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message || 'Failed to load dashboard data.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Left: Overview and Activity */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[#111418] text-3xl font-bold mb-6">Dashboard</h1>
        <h2 className="text-[#111418] text-lg font-bold mb-2">Overview</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Total Credentials */}
          <div className="flex-1 bg-white rounded-xl border border-[#f0f2f4] p-6 flex flex-col justify-between min-w-[180px]">
            <p className="text-[#637488] text-sm">Total Credentials</p>
            <p className="text-[#111418] text-2xl font-bold">{totalCredentials}</p>
            <p className="text-[#637488] text-xs">View all your credentials</p>
          </div>
          {/* Verified Credentials */}
          <div className="flex-1 bg-white rounded-xl border border-[#f0f2f4] p-6 flex flex-col justify-between min-w-[180px]">
            <p className="text-[#637488] text-sm">Verified Credentials</p>
            <p className="text-[#111418] text-2xl font-bold">{verifiedCredentials}</p>
            <p className="text-[#637488] text-xs">Credentials with successful verification</p>
          </div>
          {/* Pending Verification */}
          <div className="flex-1 bg-white rounded-xl border border-[#f0f2f4] p-6 flex flex-col justify-between min-w-[180px]">
            <p className="text-[#637488] text-sm">Pending Verification</p>
            <p className="text-[#111418] text-2xl font-bold">{pendingCredentials}</p>
            <p className="text-[#637488] text-xs">Credentials awaiting verification</p>
          </div>
        </div>
        <h2 className="text-[#111418] text-lg font-bold mb-2">Recent Activity</h2>
        <div className="flex flex-col gap-4">
          {recentActivity.length === 0 ? (
            <div className="text-[#637488] text-sm">No recent activity.</div>
          ) : (
            recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 rounded-xl border border-[#f0f2f4]">
                <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] w-12 h-12">
                  {item.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-base font-medium line-clamp-1">{item.title}</p>
                  <p className="text-[#637488] text-sm line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Right: Abstract Images */}
      {/* <div className="flex flex-col gap-6 w-full max-w-xs mx-auto lg:mx-0">
        {images.map((src, idx) => (
          <div key={idx} className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-xl border border-[#f0f2f4]" style={{ backgroundImage: `url('${src}')` }} />
        ))}
            </div> */}
    </div>
  );
} 
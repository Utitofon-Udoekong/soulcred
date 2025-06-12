"use client";

import Image from "next/image";

export default function DashboardPage() {
  // Placeholder data
  const totalCredentials = 12;
  const verifiedCredentials = 8;
  const pendingCredentials = 4;
  const recentActivity = [
    {
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
      ),
      title: "Credential: Software Engineering Certification",
      desc: "Verified successfully",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
      ),
      title: "Credential: Project Management Badge",
      desc: "Verification in progress",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      ),
      title: "Credential: Data Science Diploma",
      desc: "Verification failed",
    },
  ];
  const images = [
    "/images/abstract-1.png",
    "/images/abstract-2.png",
    "/images/abstract-3.png",
  ];

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
          {recentActivity.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 rounded-xl border border-[#f0f2f4]">
              <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] w-12 h-12">
                {item.icon}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#111418] text-base font-medium line-clamp-1">{item.title}</p>
                <p className="text-[#637488] text-sm line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right: Abstract Images */}
      <div className="flex flex-col gap-6 w-full max-w-xs mx-auto lg:mx-0">
        {images.map((src, idx) => (
          <div key={idx} className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-xl border border-[#f0f2f4]" style={{ backgroundImage: `url('${src}')` }} />
        ))}
            </div>
    </div>
  );
} 
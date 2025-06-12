'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { useUser } from '@civic/auth-web3/react';
import { useWeb3 } from '@/app/providers/Web3Provider';

export default function Home() {
  const { authStatus } = useUser();
  const { walletConnected } = useWeb3();
  const isConnected = authStatus === 'authenticated' && walletConnected;

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden">
      <Header />
      {/* Hero Section */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1 w-full">
          <div className="flex min-h-[320px] sm:min-h-[400px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-10 md:px-10" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url(/images/hero.png)'}}>
            <div className="flex flex-col gap-2 text-left w-full max-w-xl">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">Manage and Verify Soulbound Credentials</h1>
              <h2 className="text-white text-xs sm:text-sm md:text-base font-normal">SoulCred is the platform for managing and verifying soulbound NFT credentials. Issue, manage, and verify credentials with ease.</h2>
            </div>
            {isConnected && (
              <Link href="/dashboard" className="mt-4 rounded-xl h-10 md:h-12 px-4 md:px-5 bg-[#1978e5] text-white text-sm md:text-base font-bold flex items-center justify-center w-full max-w-xs">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </div>

      {/* Why SoulCred Section */}
      <section className="flex flex-col gap-10 px-4 sm:px-6 md:px-10 lg:px-0 py-10 max-w-[960px] mx-auto w-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-[#111418] text-xl sm:text-2xl md:text-4xl font-bold leading-tight max-w-[720px]">Why SoulCred?</h1>
          <p className="text-[#111418] text-sm sm:text-base font-normal max-w-[720px]">SoulCred is the platform for managing and verifying soulbound NFT credentials. Issue, manage, and verify credentials with ease.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Secure */}
          <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] bg-white p-4 flex-col">
            <div className="text-[#111418]">
              {/* ShieldCheck Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Secure</h2>
              <p className="text-[#637488] text-sm font-normal">Soulbound credentials are securely stored on the blockchain and cannot be transferred or copied.</p>
            </div>
          </div>
          {/* Scalable */}
          <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] bg-white p-4 flex-col">
            <div className="text-[#111418]">
              {/* UsersThree Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Scalable</h2>
              <p className="text-[#637488] text-sm font-normal">SoulCred is built to scale to meet the needs of any organization, from small businesses to large enterprises.</p>
            </div>
          </div>
          {/* Private */}
          <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] bg-white p-4 flex-col">
            <div className="text-[#111418]">
              {/* Key Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M160,16A80.07,80.07,0,0,0,83.91,120.78L26.34,178.34A8,8,0,0,0,24,184v40a8,8,0,0,0,8,8H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A80,80,0,1,0,160,16Zm0,144a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A64,64,0,1,1,160,160Zm32-84a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Private</h2>
              <p className="text-[#637488] text-sm font-normal">SoulCred allows you to control who can access your credentials and what information they can see.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="flex flex-col gap-10 px-4 sm:px-6 md:px-10 lg:px-0 py-10 max-w-[960px] mx-auto w-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-[#111418] text-xl sm:text-2xl md:text-4xl font-bold leading-tight max-w-[720px]">How it Works</h1>
          <p className="text-[#111418] text-sm sm:text-base font-normal max-w-[720px]">SoulCred is the platform for managing and verifying soulbound NFT credentials. Issue, manage, and verify credentials with ease.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Issue Credentials */}
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{backgroundImage: 'url(/images/issue-credentials.png)'}}></div>
            <div>
              <p className="text-[#111418] text-base font-medium">Issue Credentials</p>
              <p className="text-[#637488] text-sm font-normal">Issue soulbound credentials to your users with a few clicks.</p>
            </div>
          </div>
          {/* Manage Credentials */}
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{backgroundImage: 'url(/images/manage-credentials.png)'}}></div>
            <div>
              <p className="text-[#111418] text-base font-medium">Manage Credentials</p>
              <p className="text-[#637488] text-sm font-normal">Manage your soulbound credentials in one place.</p>
            </div>
          </div>
          {/* Verify Credentials */}
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{backgroundImage: 'url(/images/verify-credentials.png)'}}></div>
            <div>
              <p className="text-[#111418] text-base font-medium">Verify Credentials</p>
              <p className="text-[#637488] text-sm font-normal">Verify soulbound credentials with ease.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

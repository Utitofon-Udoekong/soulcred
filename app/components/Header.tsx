import Link from 'next/link';
import { UserButton, useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const { user, isLoading, authStatus } = useUser();
  const { address: wagmiAddress, walletConnected } = useWeb3();
  const userContext = useUser();
  const address = userHasWallet(userContext) ? userContext.ethereum.address : wagmiAddress;
  const isConnected = authStatus === 'authenticated' && walletConnected;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#f0f2f4] bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-[#111418]">
          <Logo />
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-9">
            <Link className="text-[#111418] text-sm font-medium" href="#">Product</Link>
            <Link className="text-[#111418] text-sm font-medium" href="#">Use Cases</Link>
            <Link className="text-[#111418] text-sm font-medium" href="#">Resources</Link>
            <Link className="text-[#111418] text-sm font-medium" href="#">Pricing</Link>
          </div>
          <div className="flex gap-2 items-center min-w-[120px] ml-6">
            {!isConnected ? (
              <UserButton className="rounded-xl px-4 bg-[#1978e5] !text-white hover:!text-black text-sm font-bold login-button" />
            ) : (
              <div className="flex items-center bg-[#f0f2f4] rounded-xl px-4 h-10 text-[#111418] text-sm font-bold">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
              </div>
            )}
          </div>
        </nav>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="#000" stroke="#000" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="#000" stroke="#000" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-[#f0f2f4] px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-4 mt-2">
            <Link className="text-[#111418] text-base font-medium" href="#" onClick={() => setMenuOpen(false)}>Product</Link>
            <Link className="text-[#111418] text-base font-medium" href="#" onClick={() => setMenuOpen(false)}>Use Cases</Link>
            <Link className="text-[#111418] text-base font-medium" href="#" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link className="text-[#111418] text-base font-medium" href="#" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <div className="flex gap-2 items-center min-w-[120px] mt-2">
              {!isConnected ? (
                <UserButton className="rounded-xl h-10 px-4 bg-[#1978e5] text-white text-base font-bold login-button w-full" />
              ) : (
                <div className="flex items-center bg-[#f0f2f4] rounded-xl px-4 h-10 text-[#111418] text-base font-bold w-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@civic/auth-web3/react";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { useResumes } from "@/app/hooks/useResumes";

export default function ProfilePage() {
  // Use our combined Web3Provider
  const { 
    userAuthenticated, 
    walletConnected, 
    address, 
    balance,
    tokenIds,
  } = useWeb3();
    // Get user data from Civic Auth
  const civicUser = useUser();
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [profileVisible, setProfileVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Add state for selected resume
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const { data: resumes = []} = useResumes();
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (userAuthenticated) {
        // Use actual user data from Civic Auth when available
        if (civicUser.user) {
          setName(civicUser.user.name || "");
          setEmail(civicUser.user.email || "");
          
          // Still use some placeholder data for fields Civic doesn't provide
          setBio(bio || "Blockchain developer with experience in smart contract development and decentralized applications.");
          setSkills(skills || "Solidity, React, TypeScript, Ethereum, Web3.js");
        }
        
        // Load stats from blockchain
        if (walletConnected) {
          try {
            // Set initial selected resume if available
            if (resumes.length > 0 && !selectedResumeId) {
              setSelectedResumeId(resumes[0].tokenId || null);
            }
            
          } catch (error) {
            console.error("Error loading resume stats:", error);
          }
        }
      }
    };
    
    loadUserData();
  }, [userAuthenticated, walletConnected, tokenIds, civicUser.user, resumes, bio, selectedResumeId, skills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#111418]">Your Profile</h1>
      
      {/* Show login button if user is not authenticated */}
      {!userAuthenticated ? (
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#f0f2f4] text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#111418]">Sign In</h2>
          <p className="text-[#637488] mb-6">
            Please sign in to view and manage your profile.
          </p>
          <UserButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#f0f2f4] mb-6">
              <h2 className="text-xl font-semibold mb-4 text-[#111418]">Wallet Information</h2>
              
              {walletConnected ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-[#637488] mb-1">Connected Address</p>
                    <p className="text-sm font-mono bg-[#f0f2f4] p-2 rounded break-all text-[#111418]">
                      {address}
                    </p>
                    <button
                      className="mt-2 px-3 py-1 bg-[#1978e5] text-white rounded hover:bg-blue-700 text-xs"
                      onClick={() => {
                        if (address) {
                          navigator.clipboard.writeText(address);
                          alert('Wallet address copied to clipboard!');
                        }
                      }}
                      disabled={!address}
                    >
                      Copy Wallet Address
                    </button>
                    <div className="mt-2 text-xs text-[#637488]">
                      Fund your wallet with <span className="font-semibold text-green-600">ETH</span> on Sepolia to pay for gas and mint your resume NFT.
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-[#637488] mb-1">Balance</p>
                    <p className="text-sm font-medium text-[#111418]">
                      {balance || "Loading..."}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm text-[#637488]">Connected with Civic Auth</p>
                  </div>
                  
                  <div className="text-sm text-green-600 font-medium">Wallet connected ✓</div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-[#637488] mb-4">
                    Your wallet is being created automatically. Please wait...
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1978e5]"></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#f0f2f4]">
              
              <div className="">
                <h3 className="text-md font-medium mb-3 text-[#111418]">Public Resume Link</h3>
                <div className="flex flex-col space-y-2">
                  {tokenIds.length > 0 ? (
                    <>
                      <select
                        value={selectedResumeId || ''}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full bg-[#f0f2f4] text-[#111418] p-2 rounded mb-2"
                      >
                        {tokenIds.map((id) => (
                          <option key={id.toString()} value={id.toString()}>
                            {resumes.find(resume => resume.tokenId === id.toString())?.name || `Resume #${id}`}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center">
                        <input
                          type="text"
                          readOnly
                          value={selectedResumeId ? `${window.location.origin}/resume/${selectedResumeId}` : "No resume selected"}
                          className="flex-1 text-sm bg-[#f0f2f4] p-2 rounded-l text-[#111418]"
                        />
                        <button
                          onClick={() => {
                            if (selectedResumeId) {
                              navigator.clipboard.writeText(`${window.location.origin}/resume/${selectedResumeId}`);
                              alert("Link copied to clipboard!");
                            }
                          }}
                          disabled={!selectedResumeId}
                          className="bg-[#1978e5] hover:bg-blue-700 text-white p-2 rounded-r disabled:bg-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#637488]">No resumes minted yet. Mint a resume to get a public link.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#f0f2f4]">
              <h2 className="text-xl font-semibold mb-6 text-[#111418]">Profile Details</h2>
              
              {saveSuccess && (
                <div className="mb-6 bg-green-100 border border-green-600 text-green-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">Profile saved successfully!</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#637488] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#f0f2f4] rounded-md bg-[#f9fafb] text-[#111418] focus:outline-none focus:ring-[#1978e5] focus:border-[#1978e5]"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#637488] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#f0f2f4] rounded-md bg-[#f9fafb] text-[#111418] focus:outline-none focus:ring-[#1978e5] focus:border-[#1978e5]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-[#637488] mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#f0f2f4] rounded-md bg-[#f9fafb] text-[#111418] focus:outline-none focus:ring-[#1978e5] focus:border-[#1978e5]"
                    placeholder="Write a brief professional bio"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="skills" className="block text-sm font-medium text-[#637488] mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3 py-2 border border-[#f0f2f4] rounded-md bg-[#f9fafb] text-[#111418] focus:outline-none focus:ring-[#1978e5] focus:border-[#1978e5]"
                    placeholder="e.g. Solidity, React, JavaScript"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      id="profileVisible"
                      type="checkbox"
                      checked={profileVisible}
                      onChange={(e) => setProfileVisible(e.target.checked)}
                      className="h-4 w-4 text-[#1978e5] border-[#f0f2f4] rounded focus:ring-[#1978e5] bg-[#f9fafb]"
                    />
                    <label htmlFor="profileVisible" className="ml-2 block text-sm text-[#637488]">
                      Make my profile publicly visible
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-[#637488]">
                    When enabled, your profile will be visible to anyone with your public link.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving || !walletConnected}
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      isSaving || !walletConnected ? "bg-gray-300" : "bg-[#1978e5] hover:bg-blue-700"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
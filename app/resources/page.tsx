'use client'
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ResourcesPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-4 text-[#1978e5]">Resources</h1>
          <p className="text-lg text-[#637488]">This page is coming soon. Stay tuned!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
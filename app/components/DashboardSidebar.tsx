import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { useUser } from "@civic/auth-web3/react";
import { useWeb3 } from '../providers/Web3Provider';
import { useState } from 'react';

const navItems = [
    {
        label: 'Home',
        href: '/dashboard',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#111418" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5V19a2.5 2.5 0 002.5 2.5h10a2.5 2.5 0 002.5-2.5V10.5" /></svg>
        ),
    },
    {
        label: 'Credentials',
        href: '/dashboard/credentials',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z"></path></svg>
        ),
    },
    {
        label: 'Verification',
        href: '/dashboard/verification-requests',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path></svg>
        ),
    },
    // {
    //     label: 'Templates',
    //     href: '/dashboard/templates',
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path></svg>
    //     ),
    // },
    {
        label: 'Organizations',
        href: '/dashboard/organizations',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>
        ),
    },
    {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#111418" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" /></svg>
        ),
    },
    {
        label: 'Help',
        href: '/dashboard/help',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
        ),
    },
];


export default function DashboardSidebar() {
    const { logout, walletConnected, userAuthenticated } = useWeb3();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const success = await logout();
            if (success) {
                router.replace('/');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    }
    const pathname = usePathname();
    return (
        <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-[#f0f2f4] flex flex-col justify-between py-4 px-2 z-30">
            <div>
                <div className="mb-8 px-4">
                    <Logo />
                </div>
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${pathname === item.href ? 'bg-[#f0f2f4] font-semibold' : ''}`}
                        >
                            <span className="text-[#111418]">{item.icon}</span>
                            <span className="text-[#111418] text-sm font-medium leading-normal">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="px-4 mt-8">
                <button onClick={handleLogout} disabled={!walletConnected || !userAuthenticated || isLoggingOut} className="flex items-center gap-3 px-3 py-2 text-[#111418] text-sm font-medium leading-normal rounded-xl hover:bg-[#f0f2f4] w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
} 
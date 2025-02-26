"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useClerk, UserButton, useUser } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'



function header() {
    
    const { signOut } = useClerk();  // Import the signOut function from Clerk
    const router = useRouter();  // Use the router to redirect after sign-out
    
    // Handle sign-out
    const handleSignOut = async () => {
        await signOut();
        router.push('/sign-in'); // Redirect to the sign-in page after sign-out
    }
    const path=usePathname();


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-small'>
        <Image src={'/logo.svg'} width={160} height={100} alt='logo' priority/>
        <ul className = 'mr-9 hidden md:flex gap-6'>
            <Link href="/dashboard">
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard'&&'text-primary font-bold'}
                `}
                >Dashboard</li>
            </Link>
            <Link href="/dashboard/questions">
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/questions'&&'text-primary font-bold'}
                `}>Questions</li>
            </Link>
            {/*<li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/upgrade'&&'text-primary font-bold'}
                `}>Upgrade</li>*/}
               <Link href={"/dashboard/aboutme"}>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/aboutme'&&'text-primary font-bold'}
                `}>About Me</li>
                </Link> 
        </ul>
        <UserButton afterSignOutUrl="/dashboard"/>
        {/*<div>
                <button 
                onClick={handleSignOut} 
                className="cursor-pointer text-gray-600 hover:text-primary font-semibold">
                    Sign Out
                </button>
        </div>*/}
        
    </div>
  )
}


export default header

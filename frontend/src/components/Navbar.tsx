// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { useToken } from '../context/TokenProvider';
import {useLoginModal} from "../context/LoginModalContext"

const Navbar = () => {

    const {token , deletecookie} = useToken();

    const {showModal} = useLoginModal();
    const navigate = useNavigate();

    return (
        <nav className="w-screen fixed top-0 left-0 right-0 z-50 bg-black text-white border-b-1 border-gray-400 h-[66px]">
            <div className="max-w-full mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left: Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                    <span className="text-2xl font-semibold tracking-wide text-white hover:underline cursor-pointer" onClick={()=>navigate("/")}>
                        CrowdVoice
                    </span>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-md mx-6 hidden md:flex items-center relative">
                    <IoSearchOutline className="absolute left-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search issues, places, tags..."
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Right: Navigation Buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/raise-issue"
                        className="hidden sm:inline-block text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                        Raise Issue
                    </Link>
                    {!token && <> <button
                        className="text-sm font-medium px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        onClick={() => showModal()}
                    >
                        Log in
                    </button>
                        <button
                            className="text-sm font-medium px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            onClick={() => showModal()}
                        >
                            Sign Up
                        </button> </>}
                    {/* User Profile */}
                    {
                        token && <button>{localStorage.getItem("username")}</button>
                    }
                    {
                        token && <button className='text-sm font-medium px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition cursor-pointer' onClick={()=> deletecookie("user")}>Log Out</button>
                    }

                </div>



            </div>
        </nav>
    );
};

export default Navbar;

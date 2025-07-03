// import React from 'react'
// import { useState } from 'react'
import { Link } from "react-router-dom"
import "../Styles/Sidebar.css"

import { MdArchive } from "react-icons/md";
import {
    IoHomeOutline, IoFlameOutline, IoDocumentTextOutline, IoBookmarkOutline, IoSettingsOutline, IoPersonOutline, IoAddCircleOutline, IoNotificationsOutline, IoHelpCircleOutline, IoLogOutOutline, IoBusinessOutline, IoPeopleOutline, IoCalendarOutline, IoMenuSharp
} from 'react-icons/io5';
import { useToken } from "../context/TokenProvider";

const navSections = [
    {
        title: 'Navigation',
        items: [
            { name: 'Home', path: '/', icon: IoHomeOutline },
            { name: 'Popular', path: '/popular', icon: IoFlameOutline },
            { name: 'My Posts', path: `/posts?user=${localStorage.getItem("uid")}`, icon: IoDocumentTextOutline },
            { name: 'My Upvotes', path: `/upvotes?user=${localStorage.getItem("uid")}`, icon: IoBookmarkOutline },
            { name: 'Saved Issues', path: `/saved-posts?user=${localStorage.getItem("username")}`, icon: IoBookmarkOutline },
            { name: 'Archieved Posts', path: `/archieved-posts?user=${localStorage.getItem("username")}`, icon: MdArchive },
        ],
    },
    {
        title: 'NGO',
        items: [
            { name: "NGO'S", path: '/ngos', icon: IoBusinessOutline },
            { name: "Register NGO", path: '/register-ngo', icon: IoBusinessOutline },
        ],
    },
    {
        title: 'Community',
        items: [
            { name: 'Communities', path: '/communities', icon: IoPeopleOutline },
            { name: 'New Community', path: '/new-community', icon: IoPeopleOutline },
            { name: 'My Communities', path: '/my-communities', icon: IoPeopleOutline },
            { name: 'Leaders', path: '/leaders', icon: IoPersonOutline },
            { name: 'Events', path: '/events', icon: IoCalendarOutline },
        ],
    },
    {
        title: 'Utilities',
        items: [
            { name: 'Raise Issue', path: '/raise-issue', icon: IoAddCircleOutline },
            { name: 'Notifications', path: '/notifications', icon: IoNotificationsOutline },
            { name: 'Settings', path: '/settings', icon: IoSettingsOutline },
            { name: 'Profile', path: '/profile', icon: IoPersonOutline },
            { name: 'Help', path: '/help', icon: IoHelpCircleOutline },
        ],
    },
];

interface SideBarProps {
    sideBar: boolean,
    togglesidebar: (prev: any) => void
}

const SideBar = (props: SideBarProps) => {
    const {deleteToken} = useToken()
    return (
        <aside className={`fixed max-h-screen z-2 ${props.sideBar ? "w-[250px]" : "w-[40px]"} top-[66px] bottom-0 left-0 bg-black border-r-1 border-gray-400 flex`}>
            <div className='w-[40px] h-full bg-black'></div>
            {props.sideBar && <nav className={`w-[210px] bg-black h-full flex flex-col gap-5 overflow-y-auto py-5 pr-5 scrollbar-container`}>
                {props.sideBar && (
                    <nav className="w-[210px] bg-black h-full overflow-y-auto py-4 pr-3 scrollbar-container text-white space-y-6">
                        {navSections.map((section, i) => (
                            <div key={i} className="px-2">
                                <h3 className="text-xs text-gray-400 uppercase mb-2">{section.title}</h3>
                                <div className="space-y-1">
                                    {section.items.map((item, index) => (
                                        <Link
                                            to={item.path}
                                            key={index}
                                            className="flex items-center gap-3 py-2 rounded-md hover:bg-gray-700 text-sm pl-1"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className='bg-white text-black flex items-center gap-2 ml-2 px-4 py-1 rounded-full text-md cursor-pointer' onClick={()=>deleteToken("user")}><IoLogOutOutline/>Log Out</button>
                    </nav>
                )}
            </nav>}
            <button className={`fixed top-[80px] ${props.sideBar ? "left-[250px]" : "left-[40px]"} -translate-x-1/2 rounded-full w-[30px] h-[30px] bg-black border-1 border-gray-400 cursor-pointer flex justify-center items-center`} onClick={() => props.togglesidebar((prev: any) => !prev)}><IoMenuSharp className='w-3/4 h-3/4 text-white' /></button>
        </aside>
    )
}

export default SideBar

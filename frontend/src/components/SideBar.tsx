import { Link } from "react-router-dom"
import "../Styles/Sidebar.css"
import { useToken } from "../context/TokenProvider";
import { navSections } from "../constants/Items";
import { IoLogOutOutline, IoMenuSharp} from 'react-icons/io5';

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

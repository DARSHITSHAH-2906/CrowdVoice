import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface CommunityType{
    name: string;
    profilePic: string;
    members: string[];
}

const PopularCommunity = () => {
    const [popularcommunity, Setcommunity] = useState<CommunityType[]>([]);
    const [seeMore, toggleSeeMore] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3000/community/popular-communities")
            .then(response => Setcommunity(response.data.communities))
            .catch(error => toast.error(error));
    }, [])

    const navigate = useNavigate();

    return (
        <aside
            className={`
        sticky top-[70px] mt-[100px] 
        w-[25vw] mr-[10px] max-w-sm bg-gray-600 rounded-2xl px-4 py-4
        flex flex-col gap-4 
        ${seeMore ? "max-h-[90vh] overflow-auto" : "max-h-max"}
      `}
        >
            {/* Title */}
            <h2 className="text-white text-xl font-semibold">Popular Communities</h2>

            {/* Issue List */}
            <div className={`flex flex-col gap-2  ${seeMore ? "max-h-max" : "max-h-[30vh] overflow-hidden"}`}>
                {popularcommunity.map((community, index) => (
                    <span
                        key={index}
                        className="text-sm text-white rounded-lg px-3 py-2 border-1 border-white hover:bg-white hover:text-black flex justify-between"
                    >
                        <div className='flex gap-2 items-center'>
                            <img src={community.profilePic} alt="logo" className='rounded-full h-7 w-7 ' />
                            <span className='text-lg hover:underline cursor-pointer' onClick={() => navigate(`/community/${community.name}`, { state: {community } })}>{community.name}</span>
                        </div>
                        <span className='text-lg'>{community.members.length} Members</span>
                    </span>
                ))}
            </div>

            {/* Toggle Button */}
            {popularcommunity.length > 6 && <button
                onClick={() => toggleSeeMore(prev => !prev)}
                className="text-blue-400 text-sm cursor-pointer w-1/3"
                aria-label="Toggle issue list"
            >
                {seeMore ? "See Less" : "See More"}
            </button>}
        </aside>
    );
};

export default PopularCommunity;

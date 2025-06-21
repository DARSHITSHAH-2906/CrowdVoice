import React, { useEffect, useState, useRef } from 'react'
import { useToken } from '../context/TokenProvider'
import axios from 'axios';
import { toast } from "react-toastify";
import CommunityCard from '../components/CommunityCard';
import { useNavigate } from 'react-router-dom';

interface CommunityType {
    _id: string;
    name: string;
    bio: string;
    profilePic: string;
    coverImage: string;
    membersCount: number;
    createdAt: string;
}

const MyCommunities = () => {
    const { token } = useToken();
    const tokenRef = useRef<string | null>(token);
    const [communities, setCommunities] = useState<CommunityType[]>([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (token) tokenRef.current = token;

        if (tokenRef.current) {
            setLoading(true);
            axios.get(`http://localhost:3000/community/my-community?token=${tokenRef.current}`)
            .then((response) => {
                setCommunities(response.data.usercommunitedata);
            })
            .catch((error) => {
                toast.error(error);
            });
        }
        setLoading(false);
    }, [token]);

    if (!token) return (<div className='min-w-screen min-h-screen bg-black/90 flex justify-center items-center text-gray-500 text-2xl'>Please login first to see your communities...</div>)

    return (
        <div id="my-communities" className={`max-w-screen min-h-screen bg-black/90 pt-[70px] pb-[55px] pl-[350px] px-5 ${communities.length > 0 ? "" : "flex justify-center items=center"}`}>
            {
                communities.length > 0 && <div id="communities" className='w-[45vw] flex flex-col gap-5'>
                    {
                        communities.map((community) => <CommunityCard community={community} />)
                    }
                </div>
            }
            {(!loading && communities.length === 0) && <div className=" flex flex-col items-center justify-center gap-4">
                <span className='text-gray-500 text-xl'> Create your first community....</span>
                <button className='w-3/4 p-4 bg-black rounded-xl text-white cursor-pointer hover:bg-black/50' onClick={() => navigate("/new-community")}>Create Community</button>
            </div>
            }

        </div>
    )
}

export default MyCommunities

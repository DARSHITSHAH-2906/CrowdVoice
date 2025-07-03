import { useEffect, useState } from 'react'
import { useToken } from '../context/TokenProvider'
import axios from 'axios';
import { toast } from "react-toastify";
import CommunityCard from '../components/CommunityCard';
import { useNavigate } from 'react-router-dom';
import { useLoginModal } from '../context/LoginModalContext';


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
    const { token, setToken ,deleteToken } = useToken();
    const { showLoginModal } = useLoginModal();
    const [communities, setCommunities] = useState<CommunityType[]>([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/community/my-community`, {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setCommunities(response.data.usercommunitedata);
                } else {
                    toast.error(response.data.error || "Failed to fetch communities");
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const res = await axios.get("http://localhost:3000/refresh-token", {
                            withCredentials: true,
                        });
                        // Save the new token
                        const newToken = res.data.token;
                        setToken(newToken, "user");

                        // Retry fetching communities with the new token
                        const response = await axios.get(`http://localhost:3000/community/my-community?token=${newToken}`);

                        if (response.status === 200) {
                            setCommunities(response.data.usercommunitedata);
                        } else {
                            toast.error(response.data.error || "Failed to fetch communities");
                        }

                    } catch (refreshError) {
                        toast.error("Session expired. Please login again.");
                                            deleteToken("user");

                        showLoginModal();

                    }
                } else {
                    toast.error(error.message || "Backend is down. Please try again later.");
                }
            }
            setLoading(false);
        }

        if (token) fetchCommunities();
    }, [token]);

if (!token) {
        return (
            <div className="max-w-3xl mt-[70px] mx-auto p-6 bg-black text-white shadow-[0px_0px_2px_0px_white] rounded-xl backdrop-blur-2xl flex flex-col text-xl items-center gap-2">
                <p>Please login first to create community...</p>
                <button onClick={showLoginModal} className="bg-blue-600 max-w-max py-2 px-4 rounded-xl cursor-pointer">Log in</button>
            </div>
        );
    }
    return (
        <div id="my-communities" className={`max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] pl-[350px] px-5 ${communities.length > 0 ? "" : "flex justify-center items=center"}`}>
            {
                communities.length > 0 && <div id="communities" className='w-[45vw] flex flex-col gap-5'>
                    {
                        communities.map((community) => <CommunityCard community={community} />)
                    }
                </div>
            }
            {(!loading && communities.length === 0) && <div className=" flex flex-col items-center justify-center gap-4">
                <span className='text-gray-500 text-xl'> Create your first community....</span>
                <button className='w-3/4 p-2 bg-white rounded-xl text-black cursor-pointer hover:bg-gray-200' onClick={() => navigate("/new-community")}>Create Community</button>
            </div>
            }

        </div>
    )
}

export default MyCommunities

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns"
import axios from 'axios';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenProvider';
import { useLoginModal } from "../context/LoginModalContext"


interface PostType {
    _id: string;
    title: string;
    description: string;
    images: string[];
    videos: string[];
    attachments: string[];
    tags: string;
    likes: number;
    dislikes: number;
    category: string;
    PlaceOfIncident: string;
    urgency: string;
    postedBy: CommunityType;
    Postedon: string;
    comments: string[];
    type: 'general' | 'community';
}

interface CommunityType {
    _id: string,
    name: string,
    bio: string,
    profilePic: string,
    coverImage: string,
    createdAt: Date,
    posts?: PostType[],
    members?: string[],
    memberCount: number
}

const CommunityPage = () => {
    const { state } = useLocation();
    const community: null | CommunityType = state.community;
    console.log(community)

    const communityRef = useRef<string | null | CommunityType>(community)
    const [communitydetails, setCommunitydetails] = useState<CommunityType | null>(null);

    const { token } = useToken();
    const tokenRef = useRef(token)

    const { showModal } = useLoginModal();

    const navigate = useNavigate();

    if (community === null) {
        return <main className=" bg-black h-screen w-screen flex justify-center items-center text-white text-xl flex-col gap-1">
            <span>Community not found or invalid navigation.</span>
            <button className='bg-white text-black p-2 rounded-full cursor-pointer' onClick={()=>window.history.back()}>Go Back</button>
        </main>;
    }

    useEffect(() => {
        if (community) communityRef.current = community._id;

        if (communityRef.current) {
            axios.get(`http://localhost:3000/community/fetchdetails/${community._id}`)
                .then((response) => setCommunitydetails(response.data.communitydata))
                .catch((error) => toast.error(error))
        }
    }, []);

    useEffect(() => {
        tokenRef.current = token;
    }, [token])

    const handleJoinCommunity = async () => {
        if (tokenRef.current) {
            try {
                const response = await axios.patch(`http://localhost:3000/community/add-member/${community._id}`, {
                    token: tokenRef.current
                })

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setCommunitydetails((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            memberCount: prev.memberCount + 1
                        };
                    });

                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log(tokenRef.current)
            showModal();
        }
    }

    return (
        communitydetails ? <div className="max-w-screen min-h-screen bg-black/90 pt-[70px] pb-[55px] pl-[350px] pr-[50px]">
            <div className='relative max-w-full bg-black p-2  rounded-xl'>
                {/* Cover Image */}
                <div className=" h-[200px] w-full rounded-lg overflow-hidden">
                    <img
                        src={communitydetails.coverImage}
                        alt="Cover"
                        className="w-full h-full object-fill"
                    />
                    <div className="absolute top-[200px] -translate-y-1/2 left-6 w-30 h-30 bg-white rounded-full border-4 border-gray-800">
                        <img
                            src={communitydetails.profilePic}
                            alt="Logo"
                            className="rounded-full w-full h-full object-fill"
                        />
                    </div>
                </div>

                {/* Community Info */}
                <div className="mt-16 px-4 flex relative">
                    <div className='space-y-2'>
                        <h1 className="text-gray-300 text-3xl font-bold hover:underline">{communitydetails.name}</h1>
                        <p className="text-gray-300 mt-2">{communitydetails.bio}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Created on: {formatDistanceToNow(communitydetails.createdAt, { addSuffix: true })}
                        </p>
                        <p className="text-sm text-gray-400 flex gap-2"><MdOutlinePeopleAlt size={20} />
                            {communitydetails.memberCount} members</p>
                    </div>

                    {/* Action Buttons */}
                    <div className='absolute bottom-0 right-0 flex gap-3'>
                        <button className='bg-black text-white border-2 border-white rounded-full p-2 hover:bg-white hover:text-black cursor-pointer' onClick={handleJoinCommunity}>Join Community</button>
                        <button className='bg-white text-black rounded-full py-2 px-4 hover:bg-gray-300 cursor-pointer' onClick={() => navigate("/add-community-post", { state: { community } })}>Add Post</button>
                    </div>
                </div>

                {/* Posts */}
                <div className="mt-6 px-4">
                    <h2 className="text-xl font-semibold mb-3">Community Posts</h2>
                    {communitydetails.posts && communitydetails.posts.length > 0 ? (
                        <div className="space-y-4">
                            {communitydetails.posts.map((post: PostType) => <PostCard post={post} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No posts yet.</p>
                    )}
                </div>
            </div>
        </div> : <div>No Such Community Exists...</div>
    );
};

export default CommunityPage;

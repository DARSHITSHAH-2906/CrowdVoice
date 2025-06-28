import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Mediaslider from '../components/Mediaslider';
import { formatDistanceToNow } from "date-fns"

import { FaRegThumbsUp, FaRegThumbsDown, FaEdit } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdArchive } from "react-icons/md";
import { MdDelete } from "react-icons/md";

interface UserType {
    _id: string;
    name: string;
    profilePic?: string;
}

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
    postedBy: UserType;
    Postedon: string;
    comments: string[];
    type: 'general';
}

type UserPostProps = {
    post: PostType;
    archieved: boolean;
    DeletePost?: (postId: string) => void;
    UnArchieve?: (postId: string) => void;
    Archieve?: (postId: string) => void;
}

const UserPost = ({ post, archieved, DeletePost, UnArchieve, Archieve }: UserPostProps) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <div key={post._id} className="relative bg-[#1e1f24] text-white rounded-2xl shadow-lg p-5 border border-gray-700 max-w-xl">
            {/* Header: User Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {post.postedBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{post.postedBy?.name}</p>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.Postedon), { addSuffix: true })}</p>
                    </div>
                </div>
            </div>

            {/* Title and Description */}
            <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
            <p className="text-gray-300 text-sm mb-2">{post.description}</p>
            <p className="text-sm text-gray-500 mb-4">📍 {post.PlaceOfIncident}</p>

            {/* Media Slider */}
            {post.images.concat(post.videos).length > 0 && (
                <div className="relative w-full h-[280px] rounded-xl overflow-hidden mb-4">
                    <Mediaslider media={post.images.concat(post.videos)} />
                </div>
            )}

            {/* Stats Row */}
            <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                <span><FaRegThumbsUp className='inline' /> {post.likes} Likes</span>
                <span><FaRegThumbsDown className='inline' /> {post.dislikes} Dislikes</span>
                <span className='cursor-pointer' onClick={() => navigate(`/post/${post.title}`, { state: { post } })}><AiOutlineComment className='inline' /> {post.comments?.length || 0} Comments</span>
            </div>

            {/* Drop Down functionality */}
            <button
                className="absolute top-4 right-2 text-gray-400 hover:text-white p-1 cursor-pointer"
                onClick={() => setMenuOpen(prev => !prev)}
            >
                <PiDotsThreeOutlineVerticalFill />
            </button>

            {menuOpen && (
                <div className="absolute top-10 right-2 bg-[#2e2f36] border border-gray-700 rounded-lg shadow-lg z-10 w-40">
                    {
                        !archieved ? <>
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3b42] flex gap-2 items-center cursor-pointer"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                className=" w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a3b42] flex gap-2 items-center  cursor-pointer"
                                onClick={() => DeletePost?.(post._id)}
                            >
                                <MdDelete /> Delete
                            </button>

                            <button
                                className=" w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3b42] flex gap-2 items-center  cursor-pointer"
                                onClick={() => Archieve?.(post._id)}
                            >
                                <MdArchive /> Archieve
                            </button>
                        </> :
                            <>
                                <button
                                    className=" w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3b42] flex gap-2 items-center  cursor-pointer"
                                    onClick={() => UnArchieve?.(post._id)}
                                >
                                    <MdArchive /> Unarchive
                                </button>
                            </>
                    }

                </div>
            )}
        </div>
    )
}

export default UserPost

import { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useToken } from "../context/TokenProvider"
import Mediaslider from '../components/Mediaslider';
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from 'react-router-dom';

import { FaRegThumbsUp, FaRegThumbsDown, FaEdit } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';
import { MdDelete } from "react-icons/md";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdArchive } from "react-icons/md";



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
    likes: number;
    dislikes: number;
    category: string;
    PlaceOfIncident: string;
    postedBy: UserType;
    Postedon: string;
    comments: string[];
}

const MyPosts = ({ archieved }: { archieved: boolean }) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const tokenRef = useRef<string | null>(null);
    const navigate = useNavigate();

    const { token } = useToken()

    useEffect(() => {
        if (token) tokenRef.current = token;

        console.log(tokenRef.current)

        if (tokenRef.current) {
            archieved ? axios.get(`http://localhost:3000/user/archieved-posts?token=${tokenRef.current}`)
                .then((response) => setPosts(response.data.posts))
                .catch((err) => console.log(err))
                .finally(()=>setMenuOpen(false))
                : axios.get(`http://localhost:3000/user/posts?token=${tokenRef.current}`)
                    .then((response) => setPosts(response.data.posts))
                    .catch((err) => console.log(err))
                    .finally(()=>setMenuOpen(false))

        }
    }, [token , archieved]);

    const ArchivePost = (id: string): void => {
        axios.patch(`http://localhost:3000/user/archivepost/${id}`, {
            isArchieved: !archieved
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenRef.current}`
            }
        })
            .then(() => {setPosts(prev => prev.filter((post) => post._id !== id));})
            .catch((err) => console.log(err))
    }

    const DeletePost = (id: string): void => {
        axios.delete(`http://localhost:3000/user/deletepost/${id}`, {
            headers: {
                Authorization: `Bearer ${tokenRef.current}`
            }
        })
            .then(() => setPosts(prev => prev.filter((post) => post._id !== id)))
            .catch((err) => console.log(err))
    }

    if (!token) return (<div className='min-w-screen min-h-screen bg-black/90 flex justify-center items-center text-gray-500 text-2xl'>Please login first to see your posts...</div>)

    return (
        <div id="posts" className="max-w-screen min-h-screen bg-black/90 pt-[70px] pb-[55px] pl-[350px] px-5 ">
            {posts.length > 0 ? (
                posts.map((post) => (
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
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3b42] flex gap-2 items-center cursor-pointer"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    className=" w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a3b42] flex gap-2 items-center  cursor-pointer"
                                    onClick={() => DeletePost(post._id)}
                                >
                                    <MdDelete /> Delete
                                </button>
                                <button
                                    className=" w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3a3b42] flex gap-2 items-center  cursor-pointer"
                                    onClick={() => ArchivePost(post._id)}
                                >
                                    <MdArchive /> {archieved ? 'Unarchive' : 'Archive'}
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm text-center">You haven't posted anything yet.</p>
            )}
        </div >

    )
}

export default MyPosts

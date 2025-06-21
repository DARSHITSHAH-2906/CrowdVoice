import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToken } from "../context/TokenProvider"
import Mediaslider from '../components/Mediaslider';
import { formatDistanceToNow } from "date-fns"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';

interface UserType {
    _id: string;
    name: string;
    profilePic?: string;
}

interface CommentType {
    comment: string;
    commentedBy: UserType; // or `UserType` if you're populating the user
    commentedOn: string;
}

const PostPage = () => {
    const { state } = useLocation();
    const post = state?.post;

    const { token } = useToken();

    const [comment, setcomment] = useState<string>('');
    const [comments, setComments] = useState<CommentType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/post/comments/${post._id}`)
            .then((response) => setComments(response.data.comments))
            .catch((error) => toast.error(error))
    }, [])

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;

        axios.post("http://localhost:3000/post/add-comment", JSON.stringify({ comment, post_id: post._id }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                const newComment: CommentType = response.data
                setComments(prev => [...prev, newComment])
            })
            .catch((error) => toast.error(error))
            .finally(() => setcomment(''));

    };

    if (!post) return <p className="text-white text-center mt-20">No post data available.</p>;

    return (
        <div className="bg-[#121316] text-white min-h-screen py-20 px-4 flex flex-col items-center">
            {/* Post */}
            <div className="bg-[#1e1f24] w-full max-w-3xl rounded-2xl p-6 shadow-lg mb-10">
                {/* Logo and name */}
                <div className='flex items-center w-full h-[50px] gap-2'>
                    {post.postedBy.profilePic ? <img src={post.postedBy.profilePic} alt="" className='rounded-full h-full' /> : <div className="bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                        {post.postedBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>}
                    <div className='flex flex-col '>
                        <span className='text-lg'>{post.postedBy.name}</span>
                        <p className="text-gray-400 text-sm mb-1"> {formatDistanceToNow(post.Postedon, { addSuffix: true })}</p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

                {/* decription */}
                <p className="mb-4">{post.description}</p>

                {post.PlaceOfIncident && <p className="italic text-sm text-gray-400 mb-6">📍 {post.PlaceOfIncident}</p>}

                {/* Media */}
                <Mediaslider media={[...post.images, ...post.videos]} />
                <p className='text-white'>{post.tags}</p>

                <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
                    <div className="flex gap-6 items-center">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition cursor-pointer">
                            <FaRegThumbsUp />
                            <span>Support ({post.likes})</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition cursor-pointer">
                            <FaRegThumbsDown />
                            <span>Unsupport ({post.dislikes})</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition cursor-pointer" onClick={() => navigate(`/post/${post.title}`, { state: { post } })}>
                            <AiOutlineComment />
                            <span>Comments ({post.comments.length})</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comment Input */}
            {token && <div className="bg-[#1e1f24] w-full max-w-3xl rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-lg font-semibold mb-4">Leave a Comment</h2>
                <textarea
                    value={comment}
                    onChange={e => setcomment(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2a2b2e] text-white resize-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Write your comment..."
                    rows={3}
                />
                <button
                    onClick={handleCommentSubmit}
                    className="mt-3 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                >
                    Submit
                </button>
            </div>}

            {/* Comments List */}
            <div className="bg-[#1e1f24] w-full max-w-3xl rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
                {comments.length > 0 ? (
                    <ul className="space-y-6">
                        {comments.map((comment, idx) => {
                            const timeAgo = formatDistanceToNow(comment.commentedOn, { addSuffix: true });
                            return (
                                <li key={idx}>
                                    <div className="flex items-center mb-1">
                                        {/* Avatar with initials */}
                                        <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold uppercase">
                                            {comment.commentedBy?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">{comment.commentedBy.name}</p>
                                            <p className="text-xs text-gray-500">{timeAgo}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 pl-11">{comment.comment}</p>
                                    <hr className="mt-4 border-gray-700" />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-400 italic">No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default PostPage;

import React from 'react';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegBookmark } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';
import { formatDistanceToNow } from "date-fns"
import { useToken } from '../context/TokenProvider';
import { useLoginModal } from '../context/LoginModalContext';

import Mediaslider from './Mediaslider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

interface UserType {
  _id: string;
  name: string;
  profilePic?: string;
}

interface CommunityType {
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
  postedBy: UserType | CommunityType;
  Postedon: string;
  comments: string[];
  type: 'general' | 'community';
}

interface PostCardProps {
  post: PostType;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const media = [...post.images, ...post.videos];
  const { token } = useToken();
  const { showModal } = useLoginModal()

  const SavePost = async () => {
    if (!token) {
      showModal();
    } else {
      const post_id = post._id;
      const resposne = await axios.patch(`http://localhost:3000/user/save-post`, {
        post_id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resposne.status === 200) {
        toast.success(resposne.data.message);
      } else {
        toast.error(resposne.data.error);
      }
    }
  }

  console.log(post)

  return (
    <main className="bg-[#121316] text-white p-6 rounded-2xl shadow-xl mb-8 w-full max-w-2xl mx-auto min-h-[650px] hover:bg-black/40 cursor-pointer">
      <div>
        {/* Post Type */}
        <div className='border-b border-gray-700 p-2'>
          <span className="text-sm italic text-gray-500 bg-gray-500/50 rounded-full py-1 px-2">{post.type === 'community' ? 'Community Post' : 'General Post'}</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-5 mt-3" >
          <div className="flex items-center gap-3">
            {post.postedBy.profilePic ?
              <img src={post.postedBy.profilePic} alt="profile" className="w-10 h-10 rounded-full" /> :
              <div className="bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                {post.postedBy?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            }
            <div>
              <p className="text-lg font-semibold text-gray-100 hover:underline" onClick={() => post.type === 'general' ? navigate(`/user/${post.postedBy.name}`, { state: { user: post.postedBy } }) : navigate(`/community/${post.postedBy.name}`, { state: { community: post.postedBy } })}>{post.postedBy.name}</p>
              <p className="text-xs text-gray-500">{formatDistanceToNow(post.Postedon, { addSuffix: true })}</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition">
            <FaRegBookmark size={20} className='cursor-pointer' onClick={SavePost} />
          </button>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-100 mb-2" onClick={() =>
          navigate(`/post/${post.title}`, { state: { post } })
        }>{post.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{post.description}</p>
        </div>

        {/* Tags & Category */}
        <div className='flex flex-col mb-2 gap-2'>
          <span>Category: <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded-full"> {post.category}</span> </span>
          <span>Urgency: <span className={`text-xs px-2 py-1 rounded-full ${post.urgency === 'Critical' ? 'bg-red-600' :
            post.urgency === 'High' ? 'bg-orange-500' :
              post.urgency === 'Medium' ? 'bg-yellow-500' :
                'bg-green-600'
            }`}>{post.urgency}</span></span>
        </div>

        {/* Location & Urgency */}
        {post.PlaceOfIncident && <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-400 italic">📍 {post.PlaceOfIncident}</p>
        </div>}
      </div>

      {/* Media Slider */}
      <Mediaslider media={media} />

      {/* Attachments */}
      {post.attachments.length > 0 && (
        <div className="mt-4 mb-4">
          <p className="text-sm text-gray-400 mb-1">Attachments:</p>
          <ul className="list-disc ml-5 text-sm text-blue-400">
            {post.attachments.map((file, index) => (
              <li key={index}><a href={file} target="_blank" rel="noopener noreferrer" className="underline">{file}</a></li>
            ))}
          </ul>
        </div>
      )}

      {post.tags &&
        <span className="text-white-700 px-2 py-1 rounded-full">{post.tags}</span>
      }

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
        <div className="flex gap-6 items-center">
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
            <FaRegThumbsUp />
            <span>Support ({post.likes})</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">
            <FaRegThumbsDown />
            <span>Unsupport ({post.dislikes})</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition" onClick={() => navigate(`/post/${post.title}`, { state: { post } })}>
            <AiOutlineComment />
            <span>Comments ({post.comments.length})</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default PostCard;

import { useState } from 'react';
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
  likes: string[];
  dislikes: string[];
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
  const { token, setToken, deleteToken } = useToken();
  const { showLoginModal } = useLoginModal()
  const [likes, setLikes] = useState(post.likes?.length | 0);
  const [dislikes, setDislikes] = useState(post.dislikes?.length | 0);
  const [isLiked, setIsLiked] = useState(post.likes.includes(localStorage.getItem("uid") || ""));
  const [isDisLiked, setIsDisLiked] = useState(post.dislikes.includes(localStorage.getItem("uid") || ""));
  console.log(isLiked , isDisLiked)

  const SavePost = async () => {
    if (!token) {
      showLoginModal();
    } else {
      const post_id = post._id;
      try {
        const resposne = await axios.patch(`https://crowdvoice.onrender.com/user/save-post`, {
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
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            const res = await axios.get("https://crowdvoice.onrender.com/refresh-token", {
              withCredentials: true,
            });
            // Save the new token
            const newToken = res.data.token;
            setToken(newToken, "user");

            // Retry
            const resposne = await axios.patch(`https://crowdvoice.onrender.com/user/save-post`, {
              post_id
            }, {
              headers: {
                'Authorization': `Bearer ${newToken}`
              }
            });

            if (resposne.status === 200) {
              toast.success(resposne.data.message);
            } else {
              toast.error(resposne.data.error);
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
    }
  }

  const likePost = async () => {
    try {
      const response = await axios.patch(`https://crowdvoice.onrender.com/post/like-post/${post._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (isLiked) {
          setLikes(prev => prev - 1);
        } else {
          setLikes(prev => prev + 1);
        }
        setIsLiked(prev => !prev);
      } else {
        toast.error(response.data.error || "Failed to like post");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        try {
          const res = await axios.get("https://crowdvoice.onrender.com/refresh-token", {
            withCredentials: true,
          });
          const newToken = res.data.token;
          setToken(newToken, "user");

          // Retry liking the post
          const response = await axios.patch(`https://crowdvoice.onrender.com/post/like-post/${post._id}`, {}, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });

          if (response.status === 200) {
            if (isLiked) {
              setLikes(prev => prev - 1);
            } else {
              setLikes(prev => prev + 1);
            }
            setIsLiked(prev => !prev);
          } else {
            toast.error(response.data.error || "Failed to like post");
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
  }

  const dislikePost = async () => {
    try {
      const response = await axios.patch(`https://crowdvoice.onrender.com/post/dislike-post/${post._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (isDisLiked) {
          setDislikes(prev => prev - 1);
        } else {
          setDislikes(prev => prev + 1);
        }
        setIsDisLiked(prev => !prev);
      } else {
        toast.error(response.data.error || "Failed to like post");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        try {
          const res = await axios.get("https://crowdvoice.onrender.com/refresh-token", {
            withCredentials: true,
          });
          const newToken = res.data.token;
          setToken(newToken, "user");

          // Retry liking the post
          const response = await axios.patch(`https://crowdvoice.onrender.com/post/dislike-post/${post._id}`, {}, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });

          if (response.status === 200) {
            if (isDisLiked) {
              setDislikes(prev => prev - 1);
            } else {
              setDislikes(prev => prev + 1);
            } setIsDisLiked(prev => !prev);
          } else {
            toast.error(response.data.error || "Failed to like post");
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
  }

  return (
    <main className="bg-[#121316] text-white p-6 rounded-2xl shadow-xl mb-8 w-full max-w-2xl max-h-max mx-auto min-h-[650px] hover:bg-black/40">
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
              <p className="text-lg font-semibold text-gray-100 hover:underline" onClick={() => post.type === 'general' ? navigate(`/user/${post.postedBy.name}`, { state: { user: post.postedBy } }) : navigate(`/community/${post.postedBy.name}`, { state: { community: post.postedBy } })}>@{post.postedBy.name}</p>
              <p className="text-xs text-gray-500">{formatDistanceToNow(post.Postedon, { addSuffix: true })}</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition">
            <FaRegBookmark size={20} className='cursor-pointer' onClick={SavePost} />
          </button>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-100 mb-2 cursor-pointer" onClick={() =>
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
          <button className={`flex items-center gap-2 text-gray-400 hover:text-green-400 transition ${isLiked ? "text-green-400" : ""}`} onClick={() => likePost()}>
            <FaRegThumbsUp />
            <span>Support ({likes})</span>
          </button>
          <button className={`flex items-center gap-2 text-gray-400 hover:text-red-400 transition ${isDisLiked ? "text-red-400" : ""}`} onClick={() => dislikePost()}>
            <FaRegThumbsDown />
            <span>Unsupport ({dislikes})</span>
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

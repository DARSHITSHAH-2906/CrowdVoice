import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard';
import { useToken } from '../context/TokenProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoginModal } from '../context/LoginModalContext';

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

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const { token, setToken, deleteToken } = useToken();
  const { showLoginModal } = useLoginModal();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(`https://crowdvoice.onrender.com/user/saved-posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        // Access token is valid, proceed to set posts
        if (response.status === 200) {
          setPosts(response.data.posts);
        } else {
          toast.error("Failed to fetch saved posts.");
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

          } catch (error) {
            toast.info("Session expired, please login again.");
            deleteToken("user");
            showLoginModal();
          }
        }
        else {
          toast.error("Backend is down, please try again later.");
        }
      }
    }

    if (token) {
      fetchSavedPosts();
    }

  }, [token])

  if (!token) return (<div className='min-w-screen min-h-screen bg-black flex justify-center items-center text-gray-500 text-2xl'>
    <div className='flex items-center justify-center flex-col gap-3'>
      <p>Please login first to see your saved posts...</p>
      <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600' onClick={showLoginModal}>Log in</button>
    </div>
  </div>
  )

  return (
    <main id="saved-posts" className='max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] pl-[350px] px-5 flex gap-25'>
      <div id="posts" className='w-[45vw] flex flex-col gap-5'>
        {
          posts.length > 0 ? (posts.map((post: PostType) => <PostCard post={post} />)) : (
            <p className="text-gray-500 text-sm text-center">You haven't saved any posts..</p>
          )
        }
      </div>
    </main>
  )
}

export default SavedPosts

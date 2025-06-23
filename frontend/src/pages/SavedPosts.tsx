import {useEffect, useState} from 'react'
import PostCard from '../components/PostCard';
import { useToken } from '../context/TokenProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

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
const SavedPosts = () => {
    const [posts, setPosts] = useState([]);
    const {token} = useToken();

    console.log(token)
    useEffect(()=>{
        axios.get(`http://localhost:3000/user/saved-posts?token=${token}`)
        .then(response => setPosts(response.data.posts))
        .catch(error => toast.error(error))
    } , [token])

  return (
    <main id="saved-posts" className='max-w-screen min-h-screen bg-[#121316] pt-[70px] pb-[55px] pl-[350px] px-5 flex gap-25'>
      <div id="posts" className='w-[45vw] flex flex-col gap-5'>
        {
          posts && posts.map((post: PostType) => <PostCard post={post}/>)
        }
      </div>
    </main>
  )
}

export default SavedPosts

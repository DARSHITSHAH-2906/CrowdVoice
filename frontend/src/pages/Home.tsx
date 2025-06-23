import { useEffect } from 'react'
import { useState } from 'react'
import PostCard from '../components/PostCard'
import Popularissues from '../components/Popularissues'
import axios from 'axios'


interface UserType {
  _id: string;
  name: string;
  profilePic: string;
}

interface CommunityType {
  _id: string;
  name: string;
  profilePic: string;
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

const Home = ({sideBar} : {sideBar : boolean}) => {

  // const [loading, setloading] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostType[] | null>(null)
  useEffect(() => {
    // setloading(true);

    axios.get("http://localhost:3000/post/fetch")
      .then((response) => {
        setPosts(response.data.posts);
        // setloading(false);
      })

  }, []);

  return (
    <main id="home" className={`max-w-screen min-h-screen bg-[#121316] pt-[70px] pb-[55px] ${sideBar ? "pl-[350px]" : "pl-[240px]"} px-5 flex gap-25`}>
      <div id="posts" className='w-[45vw] flex flex-col gap-5'>
        {
          posts && posts.map((post: PostType) => <PostCard post={post}/>)
        }
      </div>

      <Popularissues />
    </main>
  )
}

export default Home

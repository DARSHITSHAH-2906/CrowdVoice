import { useEffect } from 'react'
import { useState } from 'react'
import PostCard from '../components/PostCard'
import PopularIssues from '../components/Popularissues'
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

const Home = ({sideBar} : {sideBar : boolean}) => {

  const [posts, setPosts] = useState<PostType[] | null>(null)
  useEffect(() => {

    axios.get("https://crowdvoice.onrender.com/post")
      .then((response) => {
        setPosts(response.data.posts);
      })

  }, []);

  return (
    <main id="home" className={`max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] ${sideBar ? "pl-[350px]" : "pl-[240px]"} px-5 flex gap-25`}>
      <div id="posts" className='w-[45vw] flex flex-col gap-5'>
        {
          posts && posts.map((post: PostType) => <PostCard post={post}/>)
        }
      </div>

      <PopularIssues />
    </main>
  )
}

export default Home

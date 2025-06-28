import { useEffect, useState } from 'react'
import axios from 'axios';
import { useToken } from "../context/TokenProvider"
import UserPost from '../components/UserPost';
import { toast } from 'react-toastify';
import { useLoginModal } from '../context/LoginModalContext';


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

const ArchivedPost = () => {
    const [posts, setPosts] = useState<PostType[]>([]);

    const { token, setToken, deleteToken } = useToken()
    const { showLoginModal } = useLoginModal();

    useEffect(() => {
        const fetchPosts = async () => {
            try {

                const response = await axios.get(`http://localhost:3000/user/archieved-posts?token=${token}`)

                if (response.status === 200) {
                    setPosts(response.data.posts);
                } else {
                    // If the response status is not 200, handle it accordingly
                    toast.error(response.data.error || "Failed to fetch posts");
                }

            } catch (error: any) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        const res = await axios.get("http://localhost:3000/refresh-token", {
                            withCredentials: true,
                        });

                        // If refresh token is successful, save the token
                        const newToken = res.data.token;
                        setToken(newToken, "user");

                        const response = await axios.get(`http://localhost:3000/user/archieved-posts?token=${newToken}`)

                        if (response.status === 200) {
                            setPosts(response.data.posts);
                        } else {
                            // If the response status is not 200, handle it accordingly
                            toast.error(response.data.error || "Failed to fetch posts");
                        }

                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            // If refresh token failed, clear form data and show login modal
                            toast.info("Session expired, please login again.");
                            showLoginModal();
                        }
                        else {
                            toast.error("Backend is down, please try again later.");
                        }
                    }
                }
                else {
                    // Failed to create post
                    toast.error("Backend is down, please try again later.");
                }
            }
        }

        if (token) fetchPosts();
    }, [token]);

    const UnArchieve = async (id: string): Promise<void> => {
        try {
            const response = await axios.patch(`http://localhost:3000/user/archivepost/${id}`, {
                isArchieved: false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setPosts(prev => prev.filter((post) => post._id !== id));
                toast.success("Post unarchived successfully!");
            } else {
                toast.error(response.data.error || "Failed to unarchive post");
            }

        } catch (error: any) {
            if (error.response?.status === 401) {
                // Token expired, try to refresh
                try {
                    const res = await axios.get("http://localhost:3000/refresh-token", {
                        withCredentials: true,
                    });
                    // Save the new token
                    const newToken = res.data.token;
                    setToken(newToken, "user");

                    // Retry unarchiving the post with the new token
                    const response = await axios.patch(`http://localhost:3000/user/archivepost/${id}`, {
                        isArchieved: false
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${newToken}`
                        }
                    })

                    if (response.status === 200) {
                        setPosts(prev => prev.filter((post) => post._id !== id));
                        toast.success("Post unarchived successfully!");
                    } else {
                        toast.error(response.data.error || "Failed to unarchive post");
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

    if (!token) return (<div className='min-w-screen min-h-screen bg-black flex justify-center items-center text-gray-500 text-2xl'>
        <div className='flex items-center justify-center flex-col gap-3'>
            <p>Please login first to see your posts...</p>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600' onClick={showLoginModal}>Log in</button>
        </div>
    </div>
    )

    return (
        <div id="posts" className="max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] pl-[350px] px-5 ">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <UserPost post={post} archieved={true} UnArchieve={UnArchieve} />
                ))
            ) : (
                <p className="text-gray-500 text-sm text-center">You haven't posted anything yet.</p>
            )}
        </div >

    )
}

export default ArchivedPost

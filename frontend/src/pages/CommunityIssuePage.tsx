import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useToken } from '../context/TokenProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginModal } from '../context/LoginModalContext';

const categories = ['News', 'Event', 'Help', 'Petition', 'Discussion'];

interface FormDataType {
    title: string,
    content: string
    tags: string,
    images: File[],
    videos: File[],
    location: string,
    category: string,
    visibility: string,
    externalLink: string
}

const AddCommunityPost = () => {
    const { token, deleteToken, setToken } = useToken();
    const { showLoginModal } = useLoginModal();
    const location = useLocation();
    const navigate = useNavigate();
    const community = location.state?.community;

    const [formData, SetFormData] = useState<FormDataType>({
        title: '',
        content: '',
        tags: '',
        location: '',
        category: '',
        visibility: 'public',
        images: [],
        videos: [],
        externalLink: ''
    });

    const clearformData = () => {
        SetFormData({
            title: '',
            content: '',
            tags: '',
            location: '',
            category: '',
            visibility: 'public',
            images: [],
            videos: [],
            externalLink: ''
        })
    }

    // useEffect(() => {
    //     if (!token) {
    //         showLoginModal();
    //     }
    // }, [token])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        SetFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
        const files = e.target.files;
        if (files) {
            SetFormData((prev: FormDataType) => ({
                ...prev,
                [type]: Array.from(files),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error("Title and content are required.");
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('visibility', formData.visibility);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('attachments', formData.externalLink);
        data.append("tags", formData.tags);

        if (formData.images.length > 0) {
            formData.images.forEach((file: File) => {
                data.append("images", file);
            });
        }

        // Append videos
        if (formData.videos.length > 0) {
            formData.videos.forEach((file: File) => {
                data.append("videos", file);
            });
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/community/add-post/${community._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Post created successfully!");
                navigate(`/community/${community.name}`, { state: { community } });
            } else {
                toast.error(response.data.error);
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

                    // Retry adding post to community
                    const retryResponse = await axios.post(
                        `http://localhost:3000/community/add-post/${community._id}`,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
                    if (retryResponse.status === 200) {
                        toast.success("Post created successfully!");
                        navigate(`/community/${community.name}`, { state: { community } });
                    } else {
                        toast.error(retryResponse.data.error);
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

        clearformData();
    };

    if (!token) return (<div className='min-w-screen min-h-screen bg-black flex justify-center items-center text-gray-500 text-2xl'>
        <div className='flex items-center justify-center flex-col gap-3'>
            <p>Please login first to add post</p>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600' onClick={showLoginModal}>Log in</button>
        </div>
    </div>
    )

    if (!community) {
        return <div className="text-white text-xl">No community found.</div>;
    }

    return (
        <div className="min-h-screen bg-black pt-[80px] px-10 text-white flex justify-center">
            <div className='min-w-2xl'>
                <h1 className="text-3xl font-bold mb-6">Post in {community.name}</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl">
                    <input
                        type="text"
                        placeholder="Post Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    <textarea
                        placeholder="What's on your mind?"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="p-3 h-40 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    {/* Tags */}
                    <input
                        type="text"
                        name="tags"
                        placeholder="Add tags.."
                        value={formData.tags}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    {/* File Upload */}
                    <div>
                        <label className="block mb-1 text-sm text-gray-600">Upload Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'images')}
                            className="w-full border p-2 rounded-lg"

                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-600">Upload Videos</label>
                        <input
                            type="file"
                            multiple
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'videos')}
                            className="w-full border p-2 rounded-lg"

                        />
                    </div>

                    {/* Location */}
                    <input
                        type="text"
                        placeholder="Add location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    {/* External Link */}
                    <input
                        type="url"
                        placeholder="Attach a reference link (optional)"
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    {/* Category */}
                    <select
                        value={formData.category}
                        name="category"
                        onChange={handleChange}
                        className="p-2 bg-gray-800 border border-gray-600 rounded-lg"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Visibility */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm">Visibility:</label>
                        <label>
                            <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={formData.visibility === 'public'}
                                onChange={handleChange}
                            /> Public
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={formData.visibility === 'private'}
                                onChange={handleChange}
                            /> Community-only
                        </label>
                    </div>

                    <button
                        type="submit"
                        // disabled={!formData.title || !formData.content}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCommunityPost;

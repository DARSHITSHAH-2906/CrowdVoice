import React, { useState } from 'react'
import { useToken } from '../context/TokenProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginModal } from '../context/LoginModalContext';

interface FormDataType {
    title: string;
    description: string;
    category: string;
    placeOfIncident: string;
    images: File[];
    videos: File[];
    urgency: string
    tags: string
}

const categories = [
    "Corruption",
    "Infrastructure",
    "Healthcare",
    "Education",
    "Environment",
    "Law & Order",
    "Other"
];

const RaiseIssue = () => {
    const { token, setToken, deleteToken } = useToken();
    const { showLoginModal } = useLoginModal();

    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataType>({
        title: '',
        description: '',
        category: '',
        placeOfIncident: '',
        images: [],
        videos: [],
        urgency: '',
        tags: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: FormDataType) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
        const files = e.target.files;
        if (files) {
            setFormData((prev: FormDataType) => ({
                ...prev,
                [type]: Array.from(files),
            }));
        }
    };

    const clearformData = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            placeOfIncident: '',
            images: [],
            videos: [],
            urgency: '',
            tags: '',
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let data = new FormData();

        // Append text fields
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("placeOfIncident", formData.placeOfIncident);
        data.append("urgency", formData.urgency);
        data.append("tags", formData.tags);

        // Append images (make sure each file is appended individually under the same key)
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

        // Now send this data using axios/fetch to your backend
        try {
            const response = await axios.post("https://crowdvoice.onrender.com/post/create", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            // Post created successfully
            if (response.status !== 200) {
                toast.error(response.data.error);
            } else {
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Token expired, try to refresh
                try {
                    const res = await axios.get("https://crowdvoice.onrender.com/refresh-token", {
                        withCredentials: true,
                    });
                    
                    // If refresh token is successful, retry the post request
                    const newToken = res.data.token;
                    setToken(newToken, "user");
                    const retryResponse = await axios.post("https://crowdvoice.onrender.com/post/create", data, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Check if retry was successful
                    if (retryResponse.status === 200) {
                        toast.success(retryResponse.data.message);
                        navigate("/");
                    } else {
                        toast.error(retryResponse.data.error);
                    }
                } catch (err) {
                    // If refresh token failed, clear form data and show login modal
                    clearformData();
                    deleteToken("user");
                    toast.info("Session expired, please login again.");
                    showLoginModal();
                }
            }
            else {
                // Failed to create post
                toast.error("Backend is down, please try again later.");
            }

        }
        clearformData();
    };

    if (!token) {
        return (
            <div className="max-w-3xl mt-[70px] mx-auto p-6 bg-black text-white shadow-[0px_0px_2px_0px_white] rounded-xl backdrop-blur-2xl flex flex-col text-xl items-center gap-2">
                <p className="text-center">Please login first to raise issue</p>
                <button onClick={showLoginModal} className="bg-blue-600 max-w-max py-2 px-4 rounded-xl cursor-pointer">Log in</button>
            </div>
        );
    }

    return (
        <div className='max-w-screen min-h-screen bg-black pt-[70px] pb-[40px] flex justify-center text-white'>
            <div className="min-w-2xl mx-auto backdrop-blur-3xl p-6 rounded-xl shadow-lg ">
                <h2 className="text-2xl font-semibold text-white mb-4">Raise an Issue</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600 "
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600 resize-none"
                        required
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="placeOfIncident"
                        placeholder="Place of Incident"
                        value={formData.placeOfIncident}
                        onChange={handleChange}
                        required
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    />

                    <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        required
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    >
                        <option value="" disabled>Select urgency level</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <input
                        type="text"
                        name="tags"
                        placeholder="Add tags.."
                        value={formData.tags}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-600"
                    />

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

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 px-5 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit Issue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RaiseIssue

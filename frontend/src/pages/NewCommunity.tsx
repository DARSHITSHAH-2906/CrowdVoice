import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenProvider'

const NewCommunity = () => {
    const [logo, setLogo] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [bio, setBio] = useState<string>('');

    const navigate = useNavigate();
    const { token } = useToken();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !bio.trim() || !logo || !coverImage) {
            toast.error("Please fill out all fields.");
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', logo);
        formData.append('coverImage', coverImage);
        formData.append('name', name);
        formData.append('bio', bio);

        try {
            const response = await axios.post('http://localhost:3000/community/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const community = response.data.community
                toast.success("Community created successfully!");
                navigate(`/community/${community.name}`, { state: { community } });
            } else {
                toast.error(response.data.error);
            }
        } catch (err) {
            toast.error("Failed to create community.");
        }

        // Reset form
        setLogo(null);
        setCoverImage(null);
        setName('');
        setBio('');
    };

    if(!token){
         if (!token) return (<div className='min-w-screen min-h-screen bg-black/90 flex justify-center items-center text-gray-500 text-2xl'>Please login first to create community..</div>)
    }

    return (
        <div className="max-w-screen min-h-screen bg-black/90 pt-[70px] pl-[350px] flex items-center">
            <div className='min-w-2xl bg-black/90 p-5 rounded-2xl'>
                <h2 className="text-2xl font-bold mb-4 text-white text-center">Create New Community</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-1 text-gray-300">Community Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-2 bg-[#2a2b3c] text-white rounded-lg outline-none focus:ring focus:ring-[#555]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300">Bio / Description</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={4}
                            className="w-full p-2 bg-[#2a2b3c] text-white rounded-lg outline-none resize-none focus:ring focus:ring-[#555]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setLogo(e.target.files?.[0] || null)}
                            className="w-full p-2 bg-[#2a2b3c] text-white rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setCoverImage(e.target.files?.[0] || null)}
                            className="w-full p-2 bg-[#2a2b3c] text-white rounded-lg"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
                    >
                        Create Community
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewCommunity

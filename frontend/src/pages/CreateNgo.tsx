// pages/CreateNgo.tsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useToken } from "../context/TokenProvider";
import { useLoginModal } from "../context/LoginModalContext";

const CreateNgo = () => {
    const { token, setToken, deleteToken } = useToken();
    const { showLoginModal } = useLoginModal();

    const [formData, setFormData] = useState({
        name: "",
        mission: "",
        vision: "",
        description: "",
        causes: "",
        website: "",
        contactEmail: "",
        phone: "",
        location: "",
        logo: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData({ ...formData, [e.target.name]: file });
        }
    };

    const clearformData = () => {
        setFormData({
            name: "",
            mission: "",
            vision: "",
            description: "",
            causes: "",
            website: "",
            contactEmail: "",
            phone: "",
            location: "",
            logo: null
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newFormData = {...formData , causes : formData.causes.split(",")};
        try {
            const res = await axios.post("http://localhost:3000/ngos/create", newFormData , {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}` 
                }
            });
            if(res.status === 200){
                toast.success("NGO submitted for review!");
            }
        } catch (error: any) {
            if (error.resposne?.status === 401) {
                try {
                    const res = await axios.get("http://localhost:3000/refresh-token", {
                        withCredentials: true,
                    });

                    // If refresh token is successful, save the token
                    const newToken = res.data.token;
                    setToken(newToken, "user");

                    await axios.post("http://localhost:3000/ngos/create",newFormData, {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${newToken}` }
                    });
                    toast.success("NGO submitted for review!");

                } catch (error: any) {
                    if (error.response?.status === 401) {
                        // If refresh token failed, clear form data and show login modal.
                        toast.info("Session expired, please login again.");
                        deleteToken("user");
                        showLoginModal();
                    }
                    else {
                        toast.error(error);
                    }
                }
            } else {
                toast.error("Backend is down, please try again later.");
            }
        }
        clearformData();
    };

    if (!token) {
        return (
            <div className="max-w-3xl mt-[70px] mx-auto p-6 bg-black text-white shadow-[0px_0px_2px_0px_white] rounded-xl backdrop-blur-2xl flex flex-col text-xl items-center gap-2">
                <p className="text-center">Please log in to create an NGO.</p>
                <button onClick={showLoginModal} className="bg-blue-600 max-w-max py-2 px-4 rounded-xl cursor-pointer">Log in</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mt-[70px] mx-auto p-6 bg-black text-white shadow-[0px_0px_2px_0px_white] rounded-xl backdrop-blur-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Register NGO</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" onChange={handleChange} value={formData.name} placeholder="NGO Name" className="w-full p-2 border rounded" required />
                <textarea name="mission" onChange={handleChange} value = {formData.mission} placeholder="Mission" className="w-full p-2 border rounded" required />
                <textarea name="vision" onChange={handleChange} value={formData.vision} placeholder="Vision" className="w-full p-2 border rounded" />
                <textarea name="description" onChange={handleChange} value={formData.description}  placeholder="Describe what your NGO does..." className="w-full p-2 border rounded" required />
                <input name="causes" onChange={handleChange} value={formData.causes} placeholder="Causes (comma separated)" className="w-full p-2 border rounded" required />
                <input name="website" onChange={handleChange} value={formData.website} placeholder="Website URL" className="w-full p-2 border rounded" />
                <input name="contactEmail" onChange={handleChange} value={formData.contactEmail} placeholder="Contact Email" className="w-full p-2 border rounded" required />
                <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone Number" className="w-full p-2 border rounded" />
                <input name="location" onChange={handleChange} value={formData.location} placeholder="Location" className="w-full p-2 border rounded" />
                <input type="file" name="logo" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*" required />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit NGO</button>
            </form>
        </div>
    );
};

export default CreateNgo;

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useToken } from "../context/TokenProvider"
import { toast } from 'react-toastify';

interface LoginModalProps {
    onClose: () => void
}

const LoginModal = ({ onClose }: LoginModalProps) => {

    const { setToken } = useToken()

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleGoogleLogin = async (token: string): Promise<void> => {
        const response = await axios.post("https://crowdvoice.onrender.com/user/auth/google", {
            token: token
        }, {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const { token, message, name , uid} = response.data;
            setToken(token, "user");
            localStorage.setItem("username", name);
            localStorage.setItem("uid", uid);
            toast.success(message);
            onClose()
        } else {
            toast.error(response.data.error)
        }
    }

    const handleLogin = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault()
        const response = await axios.post("https://crowdvoice.onrender.com/user/auth", {
            email, password
        }, {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const { token, message, username, uid } = response.data;
            setToken(token, "user");
            localStorage.setItem("username", username);
            localStorage.setItem("uid", uid);
            toast.success(message);
            onClose();
        } else {
            toast.error(response.data.error)
        }

        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-black rounded-2xl shadow-xl p-8 w-[90%] max-w-md relative text-white">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-400 text-2xl"
                >
                    <IoMdClose />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                {/* Email/Password Login */}
                <form className="flex flex-col gap-4 mb-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        Log In
                    </button>
                </form>

                <div className="flex items-center justify-center w-full my-4">
                    <hr className="border-gray-400 w-1/2 text-xl" />
                    <span className="mx-4 text-gray-500 text-xl">or</span>
                    <hr className="border-gray-400 w-1/2 text-xl" />
                </div>

                {/* Google OAuth Login */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={(response) => {
                            const idToken = response.credential;
                            if (!idToken) {
                                throw new Error("Token not available");
                            }
                            handleGoogleLogin(idToken);
                        }}
                        onError={() => {
                            console.log("Google Login Failed");
                        }}
                        useOneTap={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

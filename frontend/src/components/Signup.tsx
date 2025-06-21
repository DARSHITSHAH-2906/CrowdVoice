import React , {useState} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { IoBody } from 'react-icons/io5';
import {toast} from "react-toastify"
import { useToken } from "../context/TokenProvider"

interface LoginModalProps {
    onClose: () => void
}

const SignupModal = ({ onClose }: LoginModalProps) => {
    const {setcookie} = useToken();

    const [email, setEmail] = useState<string>(' ');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');

    const handlesubmit = async (event : React.FormEvent)=>{
        event.preventDefault();

        try{
            const response = await axios.post("http://localhost:300/user/signup" , JSON.stringify({
                email , password , name
            }),{
                headers:{
                    "Content-Type": "application/json"
                }
            });

            if(response.status === 200){
                const {token , message , name} = response.data;
                setcookie("user" , token , 1);
                localStorage.setItem("username" , name)
                toast.success(message);
                onClose();
            }else{
                toast.error(response.data.error);
            }
        }catch(err){
            toast.error(`${err}`)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-black rounded-2xl shadow-xl p-8 w-[90%] max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-400 text-2xl"
                >
                    <IoMdClose />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

                {/* Email/Password Login */}
                <form className="flex flex-col gap-4 mb-4" onSubmit={handlesubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        Sign Up
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
                        onSuccess={async (response) => {
                            const idToken = response.credential;
                            console.log(idToken)
                            const res = await axios.post("http://localhost:3000/user/signup/google",
                                JSON.stringify({
                                    token: idToken
                                }),
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                    }
                                },
                            )
                            
                            if(res.status === 200){
                                const {token , message , name} = res.data
                                setcookie("user" , token , 1);
                                localStorage.setItem("username" , name)
                                toast.success(message);
                                onClose();
                            }else{
                                toast.error(res.data.error);
                            }
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

export default SignupModal;

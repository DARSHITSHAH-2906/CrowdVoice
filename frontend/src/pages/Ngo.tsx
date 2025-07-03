import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineVerified } from "react-icons/md";
import { Link } from 'react-router-dom';


interface Ngo {
    _id: string;
    name: string;
    mission: string;
    vision?: string;
    description: string;
    causes: string[];
    website?: string;
    contactEmail: string;
    phone?: string;
    location?: string;
    logo?: string;
}

const NgoList = ({ sideBar }: { sideBar: boolean }) => {
    const [ngos, setNgos] = useState<Ngo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                const res = await axios.get('http://localhost:3000/ngos'); // update URL accordingly
                setNgos(res.data.ngos);
            } catch (error) {
                console.error('Error fetching NGOs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNgos();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading NGOs...</div>;

    return (
        <main id="ngo" className={`max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] ${sideBar ? "pl-[350px]" : "pl-[240px]"} px-5 flex gap-25 flex-wrap`}>
            {/* <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "> */}
            {ngos.map((ngo) => (
                    <div key={ngo._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-[1.02] duration-300 border border-gray-200">
                        {/* Image Section */}
                        {ngo.logo && (
                            <div className="relative w-full h-48 bg-gray-100">
                                <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-white text-md px-2 py-1 rounded-full shadow-sm text-green-500">
                                    <MdOutlineVerified className='inline' /> Verified
                                </div>
                            </div>
                        )}

                        {/* Content Section */}
                        <div className="p-5">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                                    {ngo.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">{ngo.name}</h2>
                            </div>

                            <p className="text-gray-600 text-sm mb-2"><strong>Mission:</strong> {ngo.mission}</p>
                            {ngo.vision && <p className="text-gray-600 text-sm mb-2"><strong>Vision:</strong> {ngo.vision}</p>}
                            <p className="text-gray-700 text-sm mb-3 line-clamp-3">{ngo.description}</p>

                            <div className="text-sm text-gray-600 mb-3">
                                <strong>Causes:</strong> {ngo.causes.join(', ')}
                            </div>

                            {ngo.location && (
                                <div className="text-sm text-gray-600">
                                    <strong>Location:</strong> {ngo.location}
                                </div>
                            )}

                            <div className="text-sm text-gray-600 mt-1">
                                <strong>Contact:</strong> {ngo.contactEmail} {ngo.phone && `| ${ngo.phone}`}
                            </div>

                            {ngo.website && (
                                <a
                                    href={ngo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-blue-600 font-medium hover:underline text-sm"
                                >
                                    Visit Website →
                                </a>
                            )}
                        </div>
                    </div>
            ))}
            {/* </div> */}
        </main>
    );
};

export default NgoList;

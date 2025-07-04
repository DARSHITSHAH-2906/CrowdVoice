import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CommunityCard from '../components/CommunityCard';
import PopularIssues from '../components/PopularCommunities';

interface CommunityType {
    _id: string;
    name: string;
    bio: string;
    profilePic: string;
    coverImage: string;
    membersCount: number;
    createdAt: string;
}

const Communities = () => {

    const [communities, setCommunities] = useState<null | CommunityType[]>(null);

    useEffect(() => {
        axios.get("https://crowdvoice.onrender.com/community/communities")
            .then((response) => setCommunities(response.data.communities))
            .catch((error) => toast.error(error))
    }, [])
    return (
        <div className='max-w-screen min-h-screen bg-black pt-[70px] pb-[55px] pl-[350px] px-5 flex gap-25'>
            {communities ? <div id="communities" className='w-[45vw] flex flex-col gap-5'>
                {
                    communities.map((community) => <CommunityCard community={community} />)
                }
            </div> : <div>No communities</div>
            }
            <PopularIssues/>
        </div>
    )
}

export default Communities

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface CommunityType {
    _id: string;
    name: string;
    bio: string;
    profilePic: string;
    coverImage: string;
    membersCount: number;
    createdAt: string;
}

const CommunityCard = ({ community }: { community: CommunityType }) => {
  const {
    name,
    bio,
    profilePic,
    coverImage,
    membersCount,
    createdAt,
  } = community;

  const navigate = useNavigate();

  return (
    <div className="bg-[#1e1f24] rounded-2xl overflow-hidden shadow-lg w-full max-w-3xl mx-auto border border-gray-700 hover:cursor-pointer" onClick={()=>navigate(`/community/${community.name}` , {state:{community}})}>
      {/* Cover Image */}
      <div className="w-full h-32">
        <img src={coverImage} alt="coverImage" className='h-full w-full object-fill' />
      </div>

      <div className="p-5 flex gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={profilePic}
            alt={name}
            className="w-20 h-20 rounded-full border-4 border-[#1e1f24] -mt-10 bg-white object-fill"
          />
        </div>

        {/* Community Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white hover:underline">{name}</h2>
          <p className="text-gray-400 text-sm mt-1">{bio}</p>
          <div className="text-gray-500 text-xs mt-2 flex gap-3">
            <span>{membersCount} Members</span>
            <span>• Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const PopularIssues = () => {
  // const issues = Array(25).fill("Garbage");
  const [popularcategory, Setcategories] = useState([]);
  const [seeMore, toggleSeeMore] = useState(false);

  useEffect(() => {
    axios.get("https://crowdvoice.onrender.com/post/popular-categories")
      .then(response => Setcategories(response.data.popularcategory))
      .catch(error => toast.error(error));
  }, [])

  return (
    <aside
      className={`
        sticky top-[70px] mt-[100px] 
        w-[25vw] mr-[10px] max-w-sm bg-gray-600 rounded-2xl px-4 py-4
        flex flex-col gap-4 
        ${seeMore ? "max-h-[90vh] overflow-auto" : "max-h-max"}
      `}
    >
      {/* Title */}
      <h2 className="text-white text-xl font-semibold">Popular Categories</h2>

      {/* Issue List */}
      <div className={`flex flex-col gap-2  ${seeMore ? "max-h-max" : "max-h-[30vh] overflow-hidden"}`}>
        {Array.isArray(popularcategory) && popularcategory.map((category, index) => (
          <span
            key={index}
            className="text-sm text-black bg-gray-300 rounded-lg px-3 py-2 hover:bg-gray-400 transition-colors flex justify-between"
          >
            <Link to={`/posts?category=${category[0]}`} className='hover:underline'>{category[0]}</Link>
            <span>{category[1]} Posts</span>
          </span>
        ))}
      </div>

      {/* Toggle Button */}
      {popularcategory.length > 6 && <button
        onClick={() => toggleSeeMore(prev => !prev)}
        className="text-blue-400 text-sm cursor-pointer w-1/3"
        aria-label="Toggle issue list"
      >
        {seeMore ? "See Less" : "See More"}
      </button>}
    </aside>
  );
};

export default PopularIssues;

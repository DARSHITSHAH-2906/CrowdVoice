import React from 'react'
import { useState } from 'react'
import PostCard from '../components/PostCard'

interface Issue {
  id: string
  title: string
  description: string
  location: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  upvotes: number
}

const Popular = () => {
    const [issues] = useState<Issue[]>([
        {
          id: '1',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          location: 'Main Street, Downtown',
          status: 'open',
          createdAt: '2024-01-15',
          upvotes: 45,
        },
        {
          id: '2',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '3',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '4',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '5',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '6',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '7',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '8',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '9',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
        {
          id: '10',
          title: 'Broken Street Light',
          description: 'Street light not working for past 3 days',
          location: 'Park Avenue',
          status: 'in-progress',
          createdAt: '2024-01-14',
          upvotes: 32,
        },
      ])
  return (
    <main id="popular" className='max-w-screen min-h-screen bg-black/90 pt-[70px] pb-[55px] pl-[400px] flex gap-5 px-5'>
        <div id="posts" className='w-[45vw] flex flex-col gap-5'>
            {
                issues.map((issue) => <IssueCard issue={issue}/>)
            }
        </div>

        {/* <Popularissues/> */}
    </main>
  )
}

export default Popular

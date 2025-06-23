import Home from "./pages/Home"
// import Popular from "./pages/Popular"
import RaiseIssue from "./pages/RaiseIssue"
import PostPage from "./pages/PostPage"
import MyPosts from "./pages/MyPosts"
import NewCommunity from "./pages/NewCommunity"
import CommunityPage from "./pages/CommunityPage"
import Communities from "./pages/Communities"
import MyCommunities from "./pages/MyCommunities"
import AddCommunityPost from "./pages/CommunityIssuePage"
import SavedPosts from "./pages/SavedPosts"
import InProgressPage from "./pages/ProgressPage"

import Navbar from "./components/Navbar"
import SideBar from "./components/SideBar"

import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useEffect, useState } from "react"

function App() {
    const [sideBar, togglesidebar] = useState<boolean>(localStorage.getItem("sidebar") === "true");
    useEffect(()=>{
      localStorage.setItem("sidebar" , `${sideBar}`)
    },[sideBar])
  
  return (
    <>
      <Navbar />
      <SideBar sideBar={sideBar} togglesidebar={togglesidebar} />
      <Routes>
        <Route path="/" element={<Home sideBar={sideBar}/>} />
        <Route path="/popular" element={<InProgressPage />}></Route>
        <Route path="/raise-issue" element={<RaiseIssue />}></Route>
        <Route path="/post/:title" element={<PostPage />}></Route>
        <Route path="/my-posts" element={<MyPosts archieved={false} />}></Route>
        <Route path="/archieved-posts" element={<MyPosts archieved={true} />} ></Route>
        <Route path="/new-community" element={<NewCommunity />}></Route>
        <Route path="/community/:name" element={<CommunityPage />}></Route>
        <Route path="/communities" element={<Communities />}></Route>
        <Route path="/my-communities" element={<MyCommunities />}></Route>
        <Route path="/add-community-post" element={<AddCommunityPost />}></Route>
        <Route path="/:name/saved-posts" element={ <SavedPosts/>}></Route>
        <Route path="/ngo" element={<InProgressPage/>}></Route>
        <Route path="/leaders" element={<InProgressPage/>}></Route>
        <Route path="/events" element={<InProgressPage/>}></Route>
        <Route path="/notifications" element={<InProgressPage/>}></Route>
        <Route path="/settings" element={<InProgressPage/>}></Route>
        <Route path="/profile" element={<InProgressPage/>}></Route>
        <Route path="/help" element={<InProgressPage/>}></Route>
      </Routes>
      <ToastContainer autoClose={1000} position="top-left" />
    </>
  )
}

export default App

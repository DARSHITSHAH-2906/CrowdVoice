import Home from "./pages/Home"
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
import ArchivedPost from "./pages/ArchievedPosts"
import AdminNgoPanel from "./pages/AdminNgoPanel"
import CreateNgo from "./pages/CreateNgo"
import NgoList from "./pages/Ngo"
import Category from "./pages/Category"

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
        <Route path="/raise-issue" element={<RaiseIssue />}></Route>
        <Route path="/archieved-posts" element={<ArchivedPost />} ></Route>
        <Route path="/user-posts" element={<MyPosts />}></Route>
        <Route path="/saved-posts" element={ <SavedPosts/>}></Route>

        <Route path="/post/:title" element={<PostPage />}></Route>
        <Route path="/posts" element={<Category sideBar={sideBar}/>}></Route>

        <Route path="/new-community" element={<NewCommunity />}></Route>
        <Route path="/community/:name" element={<CommunityPage />}></Route>
        <Route path="/communities" element={<Communities />}></Route>
        <Route path="/my-communities" element={<MyCommunities />}></Route>
        <Route path="/add-community-post" element={<AddCommunityPost />}></Route>

        <Route path="/ngos" element={<NgoList sideBar={sideBar}/>}></Route>
        <Route path="/register-ngo" element={<CreateNgo/>}></Route>

        <Route path="/popular" element={<InProgressPage />}></Route>
        <Route path="/leaders" element={<InProgressPage/>}></Route>
        <Route path="/events" element={<InProgressPage/>}></Route>
        <Route path="/notifications" element={<InProgressPage/>}></Route>
        <Route path="/settings" element={<InProgressPage/>}></Route>
        <Route path="/profile" element={<InProgressPage/>}></Route>
        <Route path="/help" element={<InProgressPage/>}></Route>

        <Route path="/admin" element={<AdminNgoPanel/>}></Route>
      </Routes>
      <ToastContainer autoClose={1000} position="top-left" />
    </>
  )
}

export default App

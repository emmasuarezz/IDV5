import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard, Profile, AddPost, Auth, ProfileSetup, UserProfile, Post } from ".";
import Layout from "../Layout";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/profileSetup" element={<ProfileSetup />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/addPost"
        element={
          <Layout>
            <AddPost />
          </Layout>
        }
      />
      <Route
        path="/userProfile/:userUID"
        element={
          <Layout>
            <UserProfile />
          </Layout>
        }
      />
      <Route
        path="/post/:postID"
        element={
          <Layout>
            <Post />
          </Layout>
        }
      ></Route>
    </Routes>
  </Router>
);

export default AppRouter;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard, Profile, AddPost, Auth, ProfileSetup } from ".";
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
    </Routes>
  </Router>
);

export default AppRouter;

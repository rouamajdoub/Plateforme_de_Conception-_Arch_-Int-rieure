import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Global/Header";
import Footer from "./Global/Footer";
import Projects from "./section/Projects";
import Architect from "./section/Architect";
import ProjectD from "./section/ProjectD";
import ArchitectProfile from "./section/ArchitectProfile";
import Liked from "./section/Liked";
const Home = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/architects" element={<Architect />} />
        <Route path="/project-details" element={<ProjectD />} />
        <Route path="/architect-profile" element={<ArchitectProfile />} />
        <Route path="/my-favorites" element={<Liked />} />


      </Routes>
      <Footer />
    </>
  );
};

export default Home;

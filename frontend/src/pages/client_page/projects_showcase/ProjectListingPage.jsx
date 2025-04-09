import React from "react";
import "./ProjectListingPage.css";
import { FaHeart, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const categories = ["category 1", "category 2", "category 3", "category 4"];
const tags = ["tag 1", "tag 2", "tag 3", "tag 4"];

const ProjectCard = () => (
  <div className="project-card">
    <img
      src="/project-placeholder.jpg"
      alt="Project"
      className="project-image"
    />
    <div className="project-info">
      <div>
        <p className="architect-name">Architect Name</p>
        <p className="budget">Budget</p>
      </div>
      <div className="folan">folan</div>
    </div>
    <div className="project-footer">
      <p className="project-title">Project Title</p>
      <FaHeart className="heart-icon" />
    </div>
  </div>
);

const Sidebar = () => (
  <div className="sidebar">
    <h2 className="sidebar-title">Recent projects</h2>
    <div className="sidebar-section">
      <h3>Category</h3>
      {categories.map((cat, index) => (
        <div key={index} className="checkbox-group">
          <input type="checkbox" defaultChecked={index === 0} />
          <label>{cat}</label>
        </div>
      ))}
    </div>
    <div className="sidebar-section">
      <h3>Tags</h3>
      {tags.map((tag, index) => (
        <div key={index} className="checkbox-group">
          <input type="checkbox" defaultChecked={index < 2} />
          <label>{tag}</label>
        </div>
      ))}
    </div>
    <div className="sidebar-section">
      <h3>Budget Range</h3>
      <input type="range" min="0" max="10000" />
      <input type="range" min="10000" max="15000" />
    </div>
  </div>
);

export default function ProjectListingPage() {
  return (
    <div className="project-page">
      <header className="header">
        <div className="logo">VISIONA</div>
        <nav className="nav">
          <a className="active-nav" href="#">
            Projects
          </a>
          <a href="#">Architects</a>
          <a href="#">My favorite</a>
        </nav>
      </header>

      <section className="search-section">
        <p className="search-heading">Find You Perfect Match</p>
        <div className="search-bar">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="project category or keywords" />
          </div>
          <div className="search-input">
            <FaMapMarkerAlt className="search-icon" />
            <input type="text" placeholder="Enter Location" />
          </div>
          <button className="search-button">Search</button>
        </div>
      </section>

      <main className="main">
        <Sidebar />
        <div className="projects-grid">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <ProjectCard key={index} />
            ))}
        </div>
      </main>
    </div>
  );
}

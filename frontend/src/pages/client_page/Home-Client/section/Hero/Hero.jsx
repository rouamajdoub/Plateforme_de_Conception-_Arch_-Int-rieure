"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import './Hero.css'; // Import the CSS file

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const handleSignUpClick = () => {
    window.location.href = "http://localhost:3000/signup"; // Redirect to the external URL
  };

  return (
    <section ref={heroRef} className="hero-section">
      <div className="container">
        <div className="content">
          <div className="text-container">
            <h1 className="hero-title">Your Vision, Our Expertise</h1>
            <p className="hero-description">
              We connect you with top-tier architects who transform your vision
              into beautifully crafted, functional spaces tailored to your
              needs.
            </p>
            <div className="button-container">
              <button className="btn btn-primary" onClick={handleSignUpClick}>
                Sign up Now
              </button>
              <button className="btn btn-text">
                <span>Learn more</span>
              </button>
            </div>
          </div>
          <div className="image-container">
            <motion.div
              className="house-placeholder"
              animate={{ translateY: [-30, 30] }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            >
              {/* Placeholder for house image */}
            </motion.div>
            <motion.div
              className="pot-placeholder"
              style={{ translateY: translateY, rotate: 30 }}
            >
              {/* Placeholder for pot image */}
            </motion.div>
            <motion.div
              className="sofa-placeholder"
              style={{ rotate: 30, translateY: translateY }}
            >
              {/* Placeholder for sofa image */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
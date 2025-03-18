import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Sidebar.css";
import Logo from "../../img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faTachometerAlt,
  faUser,
  faCalendar,
  faProjectDiagram,
  faStore,
  faFileInvoice,
  faWallet,
  faStar,
  faBox,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { title: "Dashboard", icon: faTachometerAlt, view: "dashboard" },
  { title: "Profile", icon: faUser, view: "profile" },
  { title: "Calendar", icon: faCalendar, view: "calendar" },
  { title: "Projects", icon: faProjectDiagram, view: "projects" },
  { title: "Market", icon: faStore, view: "market" },
  { title: "Invoices", icon: faFileInvoice, view: "invoices" },
  { title: "Wallet", icon: faWallet, view: "wallet" },
  { title: "Reviews", icon: faStar, view: "reviews" },
  { title: "Orders", icon: faBox, view: "orders" },
  { title: "Notifications", icon: faBell, view: "notifications" },
];

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <motion.div
        className={`sidebar ${expanded ? "" : "collapsed"}`}
        initial={{ width: 80 }}
        animate={{ width: expanded ? 250 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Toggle Button */}
        <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          <FontAwesomeIcon icon={expanded ? faAngleLeft : faBars} />
        </div>

        {/* Logo */}
        <div className="logo">
          <motion.img
            src={Logo}
            alt="logo"
            animate={{ width: expanded ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Menu Items */}
        <div className="menu">
          {menuItems.map((item, index) => (
            <motion.div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => setSelected(index)}
              whileHover={expanded ? { scale: 1.1 } : {}}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon icon={item.icon} />
              {expanded && <span>{item.title}</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

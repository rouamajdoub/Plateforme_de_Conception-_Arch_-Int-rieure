import React from "react";
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
  faFileInvoiceDollar,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { title: "Dashboard", icon: faTachometerAlt, view: "dashboard" },
  { title: "Calendar", icon: faCalendar, view: "calendar" },
  { title: "Projects", icon: faProjectDiagram, view: "projects" },
  { title: "Profile", icon: faUser, view: "profile" },
  { title: "Market", icon: faStore, view: "market" },
  { title: "Invoices", icon: faFileInvoice, view: "invoices" },
  { title: "Quotes", icon: faFileInvoiceDollar, view: "quote" },
  { title: "Notifications", icon: faBell, view: "notifications" },
];

const Sidebar = ({ expanded, setExpanded, selectedItem, setSelectedItem }) => {
  return (
    <motion.div
      className={`sidebar ${expanded ? "" : "collapsed"}`}
      initial={{ width: 80 }}
      animate={{ width: expanded ? 250 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
        <FontAwesomeIcon icon={expanded ? faAngleLeft : faBars} />
      </div>

      <div className="logo">
        <motion.img
          src={Logo}
          alt="logo"
          animate={{ width: expanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="menu-scrollable">
        <div className="menu">
          {menuItems.map((item, index) => (
            <motion.div
              className={
                selectedItem === item.view ? "menuItem active" : "menuItem"
              }
              key={index}
              onClick={() => setSelectedItem(item.view)}
              whileHover={expanded ? { scale: 1.1 } : {}}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon icon={item.icon} />
              {expanded && <span>{item.title}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

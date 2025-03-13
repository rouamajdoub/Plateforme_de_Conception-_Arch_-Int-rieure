import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profile from "../img/avatar.png";
import logo from "../img/logo.png";
import {
  faHome,
  faUsers,
  faClipboardList,
  faFileInvoiceDollar,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import { motion } from "framer-motion";

const menuItems = [
  { title: "Dashboard", icon: faHome, view: "dashboard" },
  { title: "Users", icon: faCog, view: "users" },
  { title: "Architects", icon: faUsers, view: "sign-up-req" },
  { title: "Subscriptions", icon: faFileInvoiceDollar, view: "subscriptions" },
  { title: "reviews", icon: faClipboardList, view: "reviews" },
];

const Sidebar = ({ setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
        "& .pro-sidebar": {
          height: "100vh !important",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: colors.primary[100] },
          "&::-webkit-scrollbar-thumb": { background: colors.primary[300] },
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Logo & Toggle Button */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "80px",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Profile Section */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  src={profile}
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                >
                  Admin Name
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* Sidebar Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MenuItem
                  active={selected === item.title}
                  style={{ color: colors.grey[100] }}
                  onClick={() => {
                    setSelected(item.title);
                    setCurrentView(item.view);
                  }}
                  icon={<FontAwesomeIcon icon={item.icon} />}
                >
                  <Typography>{item.title}</Typography>
                </MenuItem>
              </motion.div>
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

// Sidebar.js
import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";

const Item = ({ title, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        onClick(); // Call the onClick function to change view
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

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
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`./assets/user.jpeg`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin Name
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}
          {/* Menu items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => setCurrentView("dashboard")}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Subscription Management"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => setCurrentView("subscriptions")}
            />
            <Item
              title="User Management"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => setCurrentView("users")}
            />
            <Item
              title="Reviews Management"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => setCurrentView("reviews")}
            />
            <Item
              title="Sign Up"
              icon={<ReceiptOutlinedIcon />} // Change to appropriate icon
              selected={selected}
              setSelected={setSelected}
              onClick={() => setCurrentView("signup")}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
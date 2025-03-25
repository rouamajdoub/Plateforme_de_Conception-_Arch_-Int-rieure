import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../../../../redux/slices/ProjectSlice"; // Adjust path if needed
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

const makeStyle = (status) => {
  if (status === "Approved") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "Pending") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

export default function BasicTable() {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="Table">
      <h3>Recent Projects</h3>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      {status === "succeeded" && (
        <TableContainer
          component={Paper}
          className="TableContainer"
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <Table
            sx={{ minWidth: 650, background: "transparent" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ background: "transparent", color: "black" }}
                >
                  Project
                </TableCell>
                <TableCell
                  align="left"
                  style={{ background: "transparent", color: "black" }}
                >
                  Client
                </TableCell>
                <TableCell
                  align="left"
                  style={{ background: "transparent", color: "black" }}
                >
                  Category
                </TableCell>
                <TableCell align="left" style={{ background: "transparent" }}>
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  className="Details"
                  style={{ background: "transparent" }}
                >
                  End Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  style={{ background: "transparent" }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ background: "transparent", color: "black" }}
                  >
                    {project.title}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ background: "transparent", color: "black" }}
                  >
                    {project.clientName}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ background: "transparent", color: "black" }}
                  >
                    {project.category}
                  </TableCell>
                  <TableCell align="left" style={{ background: "transparent" }}>
                    <span className="status" style={makeStyle(project.status)}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="Details"
                    style={{ background: "transparent", color: "black" }}
                  >
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-CA")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

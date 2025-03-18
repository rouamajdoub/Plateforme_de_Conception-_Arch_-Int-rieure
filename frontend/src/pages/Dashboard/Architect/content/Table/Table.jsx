import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

function createData(name, trackingId, date, status) {
  return { name, trackingId, date, status };
}

const rows = [
  createData("Lasania Chicken Fry", 18908424, "2 March 2022", "Approved"),
  createData("Big Baza Bang", 18908424, "2 March 2022", "Pending"),
  createData("Mouth Freshner", 18908424, "2 March 2022", "Approved"),
  createData("Cupcake", 18908421, "2 March 2022", "Delivered"),
];

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
  return (
    <div className="Table">
      <h3>Recent Orders</h3>
      <TableContainer
        component={Paper}
        className="TableContainer" // Apply the transparent background class
        style={{ background: "transparent", boxShadow: "none" }} // Override inline styles
      >
        <Table
          sx={{ minWidth: 650, background: "transparent" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ background: "transparent", color: "black" }}>
                Product
              </TableCell>
              <TableCell
                align="left"
                style={{ background: "transparent", color: "black" }}
              >
                Tracking ID
              </TableCell>
              <TableCell
                align="left"
                style={{ background: "transparent", color: "black" }}
              >
                Date
              </TableCell>
              <TableCell align="left" style={{ background: "transparent" }}>
                Status
              </TableCell>
              <TableCell
                align="left"
                className="Details"
                style={{ background: "transparent" }}
              >
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                style={{ background: "transparent" }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  style={{ background: "transparent", color: "black" }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ background: "transparent", color: "black" }}
                >
                  {row.trackingId}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ background: "transparent", color: "black" }}
                >
                  {row.date}
                </TableCell>
                <TableCell align="left" style={{ background: "transparent" }}>
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell
                  align="left"
                  className="Details"
                  style={{ background: "transparent" }}
                >
                  Details
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

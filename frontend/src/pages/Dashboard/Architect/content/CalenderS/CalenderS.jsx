import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import "./CalenderS.css"; // Import your CSS file

// Static events for demo purposes
const events = [
  { date: new Date(2025, 2, 10), type: "meeting", description: "Team Meeting" }, // April 10, 2025
  {
    date: new Date(2025, 2, 15),
    type: "projectStart",
    description: "Project Kickoff",
  }, // April 15, 2025
  {
    date: new Date(2025, 2, 20),
    type: "projectDeadline",
    description: "Project Deadline",
  }, // April 20, 2025
];

// Define colors for event types
const eventColors = {
  meeting: "blue",
  projectStart: "green",
  projectDeadline: "red",
};

const CalenderS = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();

  // When a day is clicked, check if there are any events and navigate if yes
  const onClickDay = (value) => {
    const dayEvents = events.filter(
      (ev) => ev.date.toDateString() === value.toDateString()
    );

    if (dayEvents.length > 0) {
      navigate("/calendar");
    }
  };

  // Show tooltip on mouse enter
  const handleMouseEnter = (date, event, clientX, clientY) => {
    const dayEvents = events.filter(
      (ev) => ev.date.toDateString() === date.toDateString()
    );

    if (dayEvents.length > 0) {
      const tooltipContent = dayEvents.map((ev) => ev.description).join(", ");
      setTooltip({
        visible: true,
        content: tooltipContent,
        x: clientX,
        y: clientY,
      });
    }
  };

  // Hide tooltip on mouse leave
  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  // This function adds a small colored dot for each event on the day tile
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        (ev) => ev.date.toDateString() === date.toDateString()
      );
      return (
        <div
          style={{
            marginTop: 4,
            display: "flex",
            gap: 4,
            justifyContent: "center",
          }}
          onMouseEnter={(e) => handleMouseEnter(date, e, e.clientX, e.clientY)}
          onMouseLeave={handleMouseLeave}
        >
          {dayEvents.map((ev, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: eventColors[ev.type],
              }}
            ></span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calenderS-container">
      <h3 className="text-xl font-bold mb-4">Your Meetings & Reminders</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        onClickDay={onClickDay}
        tileContent={tileContent}
      />

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            left: tooltip.x + 10, // Offset from mouse pointer
            top: tooltip.y + 10, // Offset from mouse pointer
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default CalenderS;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "../../../../../redux/slices/eventSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import "./Calendar.css";

const Calendar = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  // State for event dialog
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    dispatch(fetchEvents());
    console.log("Fetching events...");
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format events for FullCalendar
  const formattedEvents = Array.isArray(events)
    ? events.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        extendedProps: {
          description: event.description,
          location: event.location,
          createdBy: event.createdBy,
          _id: event._id,
        },
      }))
    : [];

  const handleDateClick = (selected) => {
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = selected.startStr.split("T")[0];

    setEventForm({
      title: "",
      description: "",
      date: formattedDate,
      location: "",
    });
    setDialogMode("add");
    setOpenDialog(true);
  };

  const handleEventClick = (selected) => {
    const event = events.find(
      (e) => e._id === selected.event.extendedProps._id
    );

    if (event) {
      // Format the date to YYYY-MM-DD for the date input
      const formattedDate = new Date(event.date).toISOString().split("T")[0];

      setSelectedEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || "",
        date: formattedDate,
        location: event.location || "",
      });
      setDialogMode("edit");
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventForm({
      title: "",
      description: "",
      date: "",
      location: "",
    });
    setSelectedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm({
      ...eventForm,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!eventForm.title || !eventForm.date) {
      alert("Title and date are required");
      return;
    }

    if (dialogMode === "add") {
      dispatch(addEvent(eventForm));
    } else {
      dispatch(
        updateEvent({
          id: selectedEvent._id,
          eventData: eventForm,
        })
      );
    }

    handleDialogClose();
  };

  const handleDeleteEvent = () => {
    if (
      window.confirm(`Are you sure you want to delete '${eventForm.title}'?`)
    ) {
      dispatch(deleteEvent(selectedEvent._id));
      handleDialogClose();
    }
  };

  return (
    <Box m="20px">
      <Typography
        variant="h1"
        sx={{ color: "var(--black)", fontWeight: "bold", marginBottom: "20px" }}
      >
        Calendar
      </Typography>

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between">
          {/* Sidebar */}
          <Box flex="1 1 20%" p="15px">
            <Typography
              variant="h4"
              sx={{ color: "var(--black)", fontWeight: "bold" }}
            >
              Events
            </Typography>
            <List>
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event) => (
                  <ListItem
                    key={event._id}
                    sx={{
                      backgroundColor: "#ff919d",
                      margin: "10px 0",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const formattedDate = new Date(event.date)
                        .toISOString()
                        .split("T")[0];
                      setSelectedEvent(event);
                      setEventForm({
                        title: event.title,
                        description: event.description || "",
                        date: formattedDate,
                        location: event.location || "",
                      });
                      setDialogMode("edit");
                      setOpenDialog(true);
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography>
                            {formatDate(new Date(event.date), {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                          {event.location && (
                            <Typography variant="caption">
                              Location: {event.location}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No events</Typography>
              )}
            </List>
          </Box>

          {/* FullCalendar */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              events={formattedEvents}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
            />
          </Box>
        </Box>
      )}

      {/* Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add New Event" : "Edit Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={eventForm.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={eventForm.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            fullWidth
            value={eventForm.date}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            fullWidth
            value={eventForm.location}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {dialogMode === "edit" && (
            <Button onClick={handleDeleteEvent} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {dialogMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;

import React from "react";
import { ListItem } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { deleteTask } from "../../services/task";

const Task = ({ item, type, onDropTask, index, status, openModal }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: () => ({ ...item, index }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDropTask(item, status);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Define border color based on status
  let borderColor;
  switch (status) {
    case "Todo":
      borderColor = "black";
      break;
    case "Progressing":
      borderColor = "yellow";
      break;
    case "Done":
      borderColor = "green";
      break;
    case "Testing":
      borderColor = "blue";
      break;
    case "Blocked":
      borderColor = "red";
      break;
    default:
      borderColor = "black"; // Default color
      break;
  }

  const handleClick = () => {
    openModal(item.id); // Pass task ID to openModal function
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(item._id);
    }
  };

  return (
    <ListItem
      p="2"
      borderRadius="md"
      boxShadow="xl"
      mb="2"
      textAlign="left"
      ref={dragRef}
      borderColor={borderColor} // Set border color dynamically
      borderWidth="2px"
    >
      <div style={{ display: "flex", justifyContent: "space-between" }} className="mb-6">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <span style={{ color: "black" }}>Name:</span> {item.name}
          </div>
          <div>
            {" "}
            <span style={{ color: "black" }}>TaskID: </span> {item.taskId}
          </div>
          <div>
            <span style={{ color: "black" }}>Priority: </span>
            {item.priority}
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="red"
          className="w-4 h-4 mr-3 "
          onClick={handleDelete}
          style={{ cursor: "pointer", width: '30', height: '20' }}
        >
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>


      </div>
      <svg onClick={handleClick}
        style={{ width: '50', height: '30', cursor: "pointer", marginLeft: '150' }}
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={borderColor}
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    </ListItem>
  );
};

export default Task;
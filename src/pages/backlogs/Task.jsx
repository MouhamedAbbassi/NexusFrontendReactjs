import React from "react";
import { ListItem } from "@chakra-ui/react";
import { useDrag } from "react-dnd";

const Task = ({ item, type, onDropTask, index, status }) => {
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

  return (
    <ListItem
      p="2"
      borderRadius="md"
      boxShadow="xl"
      mb="2"
      textAlign="center"
      ref={dragRef}
      borderColor={borderColor} // Set border color dynamically
      borderWidth="1px"
    >
      {item.name}
    </ListItem>
  );
};

export default Task;

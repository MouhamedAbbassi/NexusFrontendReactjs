// Task.jsx

import React from "react";
import { ListItem } from "@chakra-ui/react";
import { useDrag } from "react-dnd";

const Task = ({ item, type, onDropTask, index, status }) => { // Add status prop
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: () => ({ ...item, index }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDropTask(item, status); // Pass status along with item
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <ListItem
      p="2"
      borderRadius="md"
      boxShadow="md"
      mb="2"
      textAlign="center"
      ref={dragRef}
    >
      {item.name}
    </ListItem>
  );
};

export default Task;

import React from "react";
import {
  Container,
  Stack,
  Flex,
  List,
  ListItem,
  Heading
} from "@chakra-ui/react";
import { useDrag } from "react-dnd";


const Players = ({ item, playerType, onDropPlayer, index }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: playerType,
    item: () => ({ ...item, index }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDropPlayer(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <ListItem p="2" borderRadius="md" boxShadow="md" mb="2" textAlign="center" ref={dragRef}>
      {item.name}
    </ListItem>
  );
};

export default Players;

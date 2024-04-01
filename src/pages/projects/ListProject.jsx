import { Avatar, Box, Button, Td, Tr } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
 import { GlobalContext } from '../../pages/context/serviceProject';

const Row = ({ id, name, description,startDate,endDate }) => {
  const { Delete, onOpen, FindOne } = useContext(GlobalContext);
  return (
    <Tr>
      <Td>
        <Avatar name={name} />
      </Td>
      <Td>{name}</Td>
      <Td>{description}</Td>
      <Td>{startDate}</Td>
      <Td>{endDate}</Td>
     
      
      <Td>
        <Box display="flex" gap="1">
          <Button colorScheme={'blue'}>
            <AiFillEdit
              onClick={() => {
                onOpen();
                FindOne(id);
              }}
            />
          </Button>
          <Button colorScheme={'red'} onClick={() => Delete(id)}>
            <AiFillDelete />
          </Button>
        </Box>
      </Td>
    </Tr>
  );
};

export default Row;

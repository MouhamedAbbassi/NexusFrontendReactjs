import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { GlobalContext } from '../../pages/context/serviceProject';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import Row from './ListProject';
import DrawerExample from './ProjectFormulaire';

function Projects() {
  const {
FetchProjects,
    Search,
    projects,
    onOpen,
    SortByName
  } = useContext(GlobalContext);

  const [query, setQuery] = useState('');
 
  useEffect(() => {
    if ( FetchProjects ) { 
      FetchProjects();
    }
  }, []); 

  const SearchHandler = () => {
    Search(query);
  };

  const triHandler = () => {
    SortByName(); // Sorting doesn't require a query parameter
  };

  const onchangeHandler = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="App">
      <Container maxW={'full'} p="4" fontSize={'18px'}>
        <Box rounded="lg" boxShadow="base" p="4">
          <Box mt="2" gap={'2'} mb="4" display={'flex'}>
            <Input type="text" onChange={onchangeHandler} />
            <Button
              leftIcon={<AiOutlineSearch />}
              colorScheme="teal"
              variant="outline"
              maxW="300px"
              minW="150px"
              onClick={SearchHandler}
            >
              Search
            </Button>

            <Button
              leftIcon={<AiOutlineSearch />}
              colorScheme="teal"
              variant="outline"
              maxW="300px"
              minW="150px"
              onClick={triHandler}
            >
              Sort by Name
            </Button>
          </Box>
        </Box>
        <Box mt="5" rounded={'lg'} boxShadow="base">
          <Box p="4" display={'flex'} justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              List Projects
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              maxW={'300px'}
              minW="150px"
              leftIcon={<AiOutlinePlus fontSize={'20px'} />}
              onClick={onOpen}
            >
              Add Projects
            </Button>
          </Box>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>description</Th>
                  <Th>startDate</Th>
                  <Th>endDate</Th>                 
                </Tr>
              </Thead>
        <Tbody>
  {projects?.map(({ _id, name, description, startDate, endDate }) => (
    <Row
      key={_id} // Unique key for each Row component
      id={_id}
      name={name}
      description={description}
      startDate={startDate}
      endDate={endDate}
    />
  ))}
</Tbody>



            </Table>
          </TableContainer>
        </Box>
        <DrawerExample />
      </Container>
    </div>
  );
}

export default Projects;

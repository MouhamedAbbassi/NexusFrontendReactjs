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
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../pages/context/serviceMembre';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import Row from './ListMembres';
import DrawerExample from './Formulaire';

function Membres() {
  const {
    FetchMembres,
    Search,
    membres,
    onOpen,
    SortByName
  } =
    useContext( GlobalContext ); 
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (FetchMembres) {
      FetchMembres();
    }
  }, []); 

  const SearchHandler = () => {
    if (Search) {
      Search(query);
    }
  };

  const triHandler = () => {
    if (SortByName) {
      SortByName(query);
    }
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
              onClick={() => SearchHandler()}
            >
              Search
            </Button>

            <Button
              leftIcon={<AiOutlineSearch />}
              colorScheme="teal"
              variant="outline"
              maxW="300px"
              minW="150px"
              onClick={() => triHandler()}
            >
              Trie
            </Button>
          </Box>
        </Box>
        <Box mt="5" rounded={'lg'} boxShadow="base">
          <Box p="4" display={'flex'} justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              List Membre
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              maxW={'300px'}
              minW="150px"
              leftIcon={<AiOutlinePlus fontSize={'20px'} />}
              onClick={onOpen} // Ensure onOpen is directly assigned to onClick
            >
              Add Membre
            </Button>
          </Box>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>email</Th>
                  <Th>phone</Th>
                </Tr>
              </Thead>
              <Tbody>
                {membres?.map(({ _id, name, email, phone }) => (
                  <Row
                    key={_id}
                    id={_id}
                    name={name}
                    email={email}
                    phone={phone}
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

export default Membres;

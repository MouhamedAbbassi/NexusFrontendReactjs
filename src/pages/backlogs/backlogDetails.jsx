import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { Container, Stack, Flex, List, Heading } from "@chakra-ui/react";
import Players from "./Players";
import { useDrop } from "react-dnd";
import { useParams } from 'react-router-dom';
const BacklogDetails = () => {

  const [backlog, setBacklogs] = useState([]); // Holds the backlog data
  const [tasks, setTasks] = useState([]); // Holds the backlog data
  const { id } = useParams();
  // Fetch backlog data from the server
  useEffect(() => {
    axios.get(`http://localhost:3000/backlog/${id}`)
          .then(response => {
        setBacklogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching backlog:', error);
      });
  }, []);
  // Fetch baglog tasks data from the server
  useEffect(() => {
    axios.get(`http://localhost:3000/backlog/${id}/tasks`)
          .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching backlog:', error);
      });
  }, []);
/////////////////////////////////////////////////////////////
  const [players, setPlayers] = useState([
    { name: "Aakanksha" },
    { name: "Sameer" },
    { name: "Rushikesh" },
    { name: "Aaquib" }
  ]);
  const [team, setTeam] = useState([]);

  const [{ isOver }, addToTeamRef] = useDrop({
    accept: "player",
    collect: (monitor) => ({ isOver: !monitor.isOver() })
  });
  const [{ isOver: isPlayerOver }, removeFromTeamRef] = useDrop({
    accept: "team",
    collect: (monitor) => ({ isOver: !monitor.isOver() })
  });

  function movePlayerToTeam(item) {
    console.log(item);
    setPlayers((prev) => prev.filter((_, ind) => ind !== item.index));
    setTeam((prev) => [...prev, item]);
  }

  function removePlayerFromTeam(item) {
    console.log(item);
    setTeam((prev) => prev.filter((_, ind) => ind !== item.index));
    setPlayers((prev) => [...prev, item]);
  }
  return (
    <>
           <div className="m-1 p-16  flex flex-col gap-12 ">
      <Card>
        
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="white">
            Backlog Table
          </Typography>
          <Link to="/dashboard/backlog" >
          <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" w-6 h-6 m-3 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
         </svg>
         </Link>
        </CardHeader>
        
        <CardBody >
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {/* Render table headers */}
                {[ "Backlog Name","", "members","", "completion",].map(el => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
                  <tr>
                    {/* Render backlog name */}
                    <td>
                      <div className="flex items-center gap-4 ml-5">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {backlog.name}
                        </Typography>
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    {/* Render dropdown menu */}
                  </tr>
            </tbody>
          </table>
        </CardBody>
        


      </Card>

      <CardHeader variant="gradient" color="gray" className="mb-8 md:ml-96 md:mr-96 p-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" color="white">
                Tasks Management
            </Typography>
    </CardHeader>

      <Container maxW="1200px" >
      <Flex justify="space-beween" height="90vh" className='text-blue-gray-400 font-bold'  align="center">
        <Stack width="300px" className='m-1 '>
          <Heading fontSize="3xl" color="black" textAlign="center">
            Todo
          </Heading>
          <List
            p="4"
            minH="70vh"
            boxShadow="xl"
            borderRadius="md"
            ref={removeFromTeamRef}
          >
            {tasks.map((ele, ind) => (
              <Players
                key={ele.name}
                item={ele}
                playerType="player"
                onDropPlayer={movePlayerToTeam}
                index={ind}
              />
            ))}
          </List>
        </Stack>
        <Stack width="300px"className='m-1'>
          <Heading fontSize="3xl" color="black" textAlign="center">
            In Progress
          </Heading>
          <List
            p="4"
            minH="70vh"
            boxShadow="xl"
            borderRadius="md"
            ref={addToTeamRef}
          >
            {team.map((ele, ind) => (
              <Players
                key={ele.name}
                item={ele}
                playerType="team"
                onDropPlayer={removePlayerFromTeam}
                index={ind}
              />
            ))}
          </List>
        </Stack>
       
        <Stack width="300px"className='m-1'>
          <Heading fontSize="3xl" color="black" textAlign="center">
            Testing
          </Heading>
          <List
            p="4"
            minH="70vh"
            boxShadow="xl"
            borderRadius="md"
            ref={addToTeamRef}
          >
            {team.map((ele, ind) => (
              <Players
                key={ele.name}
                item={ele}
                playerType="team"
                onDropPlayer={removePlayerFromTeam}
                index={ind}
              />
            ))}
          </List>
        </Stack>
        <Stack width="300px"className='m-1'>
          <Heading fontSize="3xl" color="black" textAlign="center">
            Done
          </Heading>
          <List
            p="4"
            minH="70vh"
            boxShadow="xl"
            borderRadius="md"
            ref={addToTeamRef}
          >
            {team.map((ele, ind) => (
              <Players
                key={ele.name}
                item={ele}
                playerType="team"
                onDropPlayer={removePlayerFromTeam}
                index={ind}
              />
            ))}
          </List>
        </Stack>
        <Stack width="300px"className='m-1'>
          <Heading fontSize="3xl" color="black" textAlign="center">
            Blocked
          </Heading>
          <List
            p="4"
            minH="70vh"
            boxShadow="xl"
            borderRadius="md"
            ref={addToTeamRef}
          >
            {team.map((ele, ind) => (
              <Players
                key={ele.name}
                item={ele}
                playerType="team"
                onDropPlayer={removePlayerFromTeam}
                index={ind}
              />
            ))}
          </List>
        </Stack>

      </Flex>
    </Container>
    </div>
  
 
    </>
  );
 
};

export default BacklogDetails;

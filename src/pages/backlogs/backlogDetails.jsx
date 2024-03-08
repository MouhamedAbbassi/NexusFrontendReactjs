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
import Task from "./Task";
import { useDrop } from "react-dnd";
import { useParams } from 'react-router-dom';

const BacklogDetails = () => {
  const [backlog, setBacklogs] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [blockedTasks, setBlockedTasks] = useState([]);
  const [testingTasks, setTestingTasks] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch backlog details
    axios.get(`http://localhost:3000/backlog/${id}`)
      .then(response => {
        setBacklogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching backlog:', error);
      });
  
    // Fetch tasks related to the backlog
    axios.get(`http://localhost:3000/backlog/${id}/tasks`)
      .then(response => {
        const todoTasks = response.data.filter(task => task.status === "Todo");
        const inProgressTasks = response.data.filter(task => task.status === "Progressing");
        const doneTasks = response.data.filter(task => task.status === "Done");
        const blockedTasks = response.data.filter(task => task.status === "Blocked");
        const testingTasks = response.data.filter(task => task.status === "Testing");
        setTodoTasks(todoTasks);
        setInProgressTasks(inProgressTasks);
        setDoneTasks(doneTasks);
        setBlockedTasks(blockedTasks);
        setTestingTasks(testingTasks);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, [id, todoTasks, inProgressTasks, doneTasks, blockedTasks, testingTasks]);
  

  const moveTaskToStack = (item, targetStack) => {
    // Remove the task from the old stack
    const updatedTasks = {
      Todo: todoTasks.filter(task => task._id !== item._id),
      Progressing: inProgressTasks.filter(task => task._id !== item._id),
      Done: doneTasks.filter(task => task._id !== item._id),
      Blocked: blockedTasks.filter(task => task._id !== item._id),
      Testing: testingTasks.filter(task => task._id !== item._id),
    };
  
    // Add the task to the target stack
    const updatedTask = { ...item, status: targetStack };
    updatedTasks[targetStack] = [...updatedTasks[targetStack], updatedTask];
  
    // Update the state with the new task lists
    setTodoTasks(updatedTasks.Todo);
    setInProgressTasks(updatedTasks.Progressing);
    setDoneTasks(updatedTasks.Done);
    setBlockedTasks(updatedTasks.Blocked);
    setTestingTasks(updatedTasks.Testing);
  
    // Update the status of the task on the backend
    axios.put(`http://localhost:3000/tasks/${item._id}/status/${targetStack}`)
      .then(response => {
        console.log('Task status updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };
  
  // Define drop targets for each stack
  const [{ isOver: isTodoOver }, dropTodoRef] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      moveTaskToStack(item, "Todo"); // Pass status as "Todo"
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isInProgressOver }, dropInProgressRef] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      moveTaskToStack(item, "Progressing"); // Pass status as "Progressing"
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isDoneOver }, dropDoneRef] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      moveTaskToStack(item, "Done"); // Pass status as "Done"
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isBlockedOver }, dropBlockedRef] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      moveTaskToStack(item, "Blocked"); // Pass status as "Blocked"
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isTestingOver }, dropTestingRef] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      moveTaskToStack(item, "Testing"); // Pass status as "Testing"
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="m-1 p-16  flex flex-col gap-12 ">
      <Card  className='mx-28'>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 mx-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="white">
            Backlog Table
          </Typography>
          <Link to="/dashboard/backlog" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" w-6 h-6 m-3 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody>
          <table className="w-full min-w-[640px] table-auto mx-10">
            <thead>
              <tr>
                {["Backlog Name", "", "members", "", "completion",].map((el, index) => (
                  <th key={index} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
      <CardHeader  variant="gradient" color="gray" className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' ,height: '60px'}}>
        <Typography variant="h6" color="white">
          Tasks Management
        </Typography>
      </CardHeader>
      <Container maxW="1400px">
        <Flex justify="space-beween" height="70vh" className='text-blue-gray-400 font-bold' align="center">
          {/* Render todo stack */}
          <Stack   width="300px"className="m-1"   >
          <Heading fontSize="2xl" fontFamily="sans-serif" color="black"   textAlign="center" >
              Todo
            </Heading>
            <List
              p="4"
              minH="70vh"
              boxShadow="xl"
              borderRadius="md"
              ref={dropTodoRef}
              backgroundColor={isTodoOver ? "gray.50" : "transparent"}
              borderWidth="1px"
            >
              {todoTasks && todoTasks.map((task, index) => (
                <Task
                  key={task._id}
                  item={task}
                  onDropTask={() => moveTaskToStack(task, "Todo")} // Pass status as "Todo"
                  index={index}
                  type="task"
                  status="Todo"
                />
              ))}
            </List>
          </Stack>

          {/* Render in progress stack */}
          <Stack   width="300px"className="m-1"   >
          <Heading fontSize="2xl" fontFamily="sans-serif" color="black"  textAlign="center" >
              Progressing
            </Heading>
            <List
              p="4"
              minH="70vh"
              boxShadow="xl"
              borderRadius="md"
              ref={dropInProgressRef}
              backgroundColor={isInProgressOver ? "gray.50" : "transparent"}
              borderWidth="1px"
            >
              {inProgressTasks && inProgressTasks.map((task, index) => (
                <Task
                  key={task._id}
                  item={task}
                  onDropTask={() => moveTaskToStack(task, "Progressing")} // Pass status as "Progressing"
                  index={index}
                  type="task"
                  status="Progressing"
                />
              ))}
            </List>
          </Stack>

          {/* Render testing stack */}
          <Stack   width="300px"className="m-1"   >
          <Heading fontSize="2xl" fontFamily="sans-serif" color="black"   textAlign="center" >
              Testing
            </Heading>
            <List
              p="4"
              minH="70vh"
              boxShadow="xl"
              borderRadius="md"
              ref={dropTestingRef}
              backgroundColor={isTestingOver ? "gray.50" : "transparent"}
              borderWidth="1px"
            >
              {testingTasks && testingTasks.map((task, index) => (
                <Task
                  key={task._id}
                  item={task}
                  onDropTask={() => moveTaskToStack(task, "Testing")} // Pass status as "Testing"
                  index={index}
                  type="task"
                  status="Testing"
                />
              ))}
            </List>
          </Stack>

          {/* Render done stack */}
          <Stack   width="300px"className="m-1" >
          <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center" >
              Done
            </Heading>
            <List
              p="4"
              minH="70vh"
              boxShadow="xl"
              borderRadius="md"
              ref={dropDoneRef}
              backgroundColor={isDoneOver ? "gray.50" : "transparent"}
              borderWidth="1px"
            >
              {doneTasks && doneTasks.map((task, index) => (
                <Task
                  key={task._id}
                  item={task}
                  onDropTask={() => moveTaskToStack(task, "Done")} // Pass status as "Done"
                  index={index}
                  type="task"
                  status="Done"
                />
              ))}
            </List>
          </Stack>

          {/* Render blocked stack */}
          <Stack   width="300px"className="m-1" variant="gradient" color="gray"    >
          <Heading fontSize="2xl" fontFamily="sans-serif" color="black"  textAlign="center" >
               Blocked
          </Heading>
            <List
              p="4"
              minH="70vh"
              boxShadow="xl"
              borderRadius="md"
              ref={dropBlockedRef}
              backgroundColor={isBlockedOver ? "gray.50" : "transparent"}
              borderWidth="1px" 
              
            >
              {blockedTasks && blockedTasks.map((task, index) => (
                <Task
                  key={task._id}
                  item={task}
                  onDropTask={() => moveTaskToStack(task, "Blocked")} // Pass status as "Blocked"
                  index={index}
                  type="task"
                  status="Blocked"
                />
              ))}
            </List>
          </Stack>


        </Flex>
      </Container>
    </div>
  );
};

export default BacklogDetails;

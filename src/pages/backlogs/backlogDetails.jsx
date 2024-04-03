import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Progress,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { Container, Stack, Flex, List, Heading } from "@chakra-ui/react";
import Task from "./Task";
import { useDrop } from "react-dnd";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks,fetchBacklog } from '../../reduxToolkit/actions/taskActions';
import ModalTasks from "./ModalTasks";

const BacklogDetails = () => {
  const [completion, setompletions] = useState([]);
  const [backlog, setBacklogs] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [blockedTasks, setBlockedTasks] = useState([]);
  const [testingTasks, setTestingTasks] = useState([]);
  const [tasksList, settasksList] = useState([]);
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
    // Fetch Completion related to the backlog

      axios.get(`http://localhost:3000/backlog/${id}/completion`)
      .then(response => {
        setompletions(response.data);
      })
      .catch(error => {
        console.error('Error fetching backlog:', error);
      });
  
    // Fetch tasks related to the backlog
    axios.get(`http://localhost:3000/backlog/${id}/tasks`)
      .then(response => {
        const tasksList = response.data;
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
        settasksList(testingTasks);
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


  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.tasks);

  useEffect(() => {
    // Dispatch action to  fetch Backlog when component mounts
    dispatch(fetchBacklog());
  }, [dispatch]);

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };
  

  const [selectedTaskId, setSelectedTaskId] = useState(null);

const openModal = (taskId) => {
  setSelectedTaskId(taskId);
  setOpen(true);
};

const closeModal = () => {
  setSelectedTaskId(null);
  setOpen(false);
};
  return (
    <div className="m-1 p-4 sm:p-8 md:p-16 flex flex-col gap-4 sm:gap-8">
    <Card className='mx-4 sm:mx-auto sm:w-11/12 md:w-full lg:w-10/12 xl:w-9/12'>
    <CardHeader variant="gradient" color="gray" className="mb-4 sm:mb-8 p-4 sm:p-6 mx-2 sm:mx-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="white">Backlog Table</Typography>
          <Link to="/dashboard/backlog">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-3 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody>
        <table className="w-full min-w-[320px] sm:min-w-[640px] table-auto mx-2 sm:mx-4">
            <thead>
              <tr>
                {["", "Backlog Name", "Members", "Completion"].map((el, index) => (
                  <th key={index} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{el}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <div className="flex items-center gap-4 ml-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      {backlog?.name}
                      </Typography>
                  </div>
                </td>
                <td></td>
                <td className="py-3 px-5">
                  <div className="w-10/12">
                    <Typography variant="small" className="mb-1 block text-xs font-medium text-blue-gray-600">
                      {(completion * 100).toFixed(1)} %
                      </Typography>
                    <Progress
                     value={completion * 100} 
                      variant="gradient"
                      color={
                        completion * 100 === 100
                         ? "green"
                          : completion * 100 >= 70
                         ? "yellow"
                         : completion * 100 >= 40
                         ? "blue"
                         : "red"
                        }
                      className="h-1"
                      style={{ width: '150px' }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
      <CardHeader variant="gradient" color="gray" className="" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', height: '60px' }}>
        <Typography variant="h6" color="white" className='ml-8'>Tasks Management</Typography>
        <Link to={`/backlog/details/addTask/${id}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-8 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </Link>
      </CardHeader>
      <Container maxW="1400px">
      <Flex justify="space-between" direction={{ base: "column", md: "row" }} className='text-blue-gray-400 font-bold' align="center">
          {/* Render todo stack */}
          
          <Stack width="300px" className="m-1">
            <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center">Todo</Heading>
            <List 
                    style={{overflowY: "auto",maxHeight: "500px",scrollbarWidth: "thin",}}
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
                  onDropTask={() => moveTaskToStack(task, "Todo")}
                  index={index}
                  type="task"
                  status="Todo"
                  openModal={() => openModal(task._id)} // Pass the task ID to openModal
                  />
              ))}
            </List>
          </Stack>
          {/* Render in progress stack */}
          <Stack width="300px" className="m-1">
            <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center">Progressing</Heading>
            <List style={{ maxHeight: "500px", overflowY: "auto" , scrollbarWidth: "thin"}}
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
                  onDropTask={() => moveTaskToStack(task, "Progressing")}
                  index={index}
                  type="task"
                  status="Progressing"
                  openModal={() => openModal(task._id)} // Pass the task ID to openModal
                  />
              ))}
            </List>
          </Stack>
          {/* Render testing stack */}
          <Stack width="300px" className="m-1">
            <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center">Testing</Heading>
            <List style={{ maxHeight: "500px", overflowY: "auto", scrollbarWidth: "thin" }}
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
                  onDropTask={() => moveTaskToStack(task, "Testing")}
                  index={index}
                  type="task"
                  status="Testing"
                  openModal={() => openModal(task._id)} // Pass the task ID to openModal
                  />
              ))}
            </List>
          </Stack>
          {/* Render done stack */}
          <Stack width="300px" className="m-1">
            <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center">Done</Heading>
            <List style={{ maxHeight: "500px", overflowY: "auto" , scrollbarWidth: "thin"}}
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
                  onDropTask={() => moveTaskToStack(task, "Done")}
                  index={index}
                  type="task"
                  status="Done"
                  openModal={() => openModal(task._id)} // Pass the task ID to openModal
                  />
              ))}
            </List>
          </Stack>
          {/* Render blocked stack */}
          <Stack width="300px" className="m-1" variant="gradient" color="gray">
            <Heading fontSize="2xl" fontFamily="sans-serif" color="black" textAlign="center">Blocked</Heading>
            <List style={{ maxHeight: "500px", overflowY: "auto" , scrollbarWidth: "thin"}}
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
                  onDropTask={() => moveTaskToStack(task, "Blocked")}
                  index={index}
                  type="task"
                  status="Blocked"
                  openModal={() => openModal(task._id)} // Pass the task ID to openModal
                  />
              ))}
            </List>
          </Stack>
          <ModalTasks open={open} setOpen={setOpen} taskId={selectedTaskId} closeModal={closeModal} />
          

        </Flex>
      </Container>
    </div>
  );
};

export default BacklogDetails;

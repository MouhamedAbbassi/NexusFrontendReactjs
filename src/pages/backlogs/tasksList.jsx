import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const AddBacklog = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/backlog/${id}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [id]);

// Function to group tasks by the first integer in taskId and sort them by the second and third integers
const groupTasksByFirstInteger = () => {
  const groupedTasks = {};
  tasks.forEach(task => {
    const firstInteger = task.taskId.split('.')[0];
    const secondInteger = parseInt(task.taskId.split('.')[1]);
    const thirdInteger = parseInt(task.taskId.split('.')[2]);
    if (!groupedTasks[firstInteger]) {
      groupedTasks[firstInteger] = [];
    }
    groupedTasks[firstInteger].push(task);
    // Sort tasks within each group based on the second and third integers of taskId
    groupedTasks[firstInteger].sort((a, b) => {
      if (parseInt(a.taskId.split('.')[1]) === parseInt(b.taskId.split('.')[1])) {
        return parseInt(a.taskId.split('.')[2]) - parseInt(b.taskId.split('.')[2]);
      } else {
        return parseInt(a.taskId.split('.')[1]) - parseInt(b.taskId.split('.')[1]);
      }
    });
  });
  return groupedTasks;
};


  const handleTaskChange = (groupId, taskId) => {
    setSelectedTasks({
      ...selectedTasks,
      [groupId]: taskId,
    });
  };

  return (
    <div className="w-full md:w-2/3 m-1 p-4 md:p-16 mx-auto flex flex-col gap-8 md:gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-4 md:p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Tasks List
          </Typography>
          <Link to={`/backlog/details/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody className="p-4 md:p-6 flex flex-col justify-center">
          {Object.entries(groupTasksByFirstInteger()).map(([group, tasks]) => (
            <div key={group} className="mb-4 mr-4">
              <Typography variant="subtitle1" className="mb-2">
               <b><b>Tasks for user {group}</b></b> 
              </Typography>
              <select
               className="pl-1 pr-4 py-2 mt-4 md:mt-5 rounded-lg border border-gray-400 shadow-sm focus:outline-none focus:border-black focus:ring-black w-full"
                value={selectedTasks[group] || ''}
                onChange={(e) => handleTaskChange(group, e.target.value)}
                style={{ padding: '8px', fontSize: '16px' }}
              >
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    TaskiD: {task.taskId} / Name: {task.name} / Staus: {task.status} 
                  </option>
                ))}
              </select>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default AddBacklog;

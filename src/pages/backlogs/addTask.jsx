import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { addTaskAsync } from '../../reduxToolkit/reducers/slice';

const AddTask = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    taskId: '',
    userStory: '',
    deadLine: '',
    priority: 'Medium',
  });
  const [error, setError] = useState('');
  const [lastTaskId, setLastTaskId] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLastTaskId = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/backlog/${id}/tasks`);
        const tasks = response.data;
        if (tasks.length > 0) {
          const lastTask = tasks[tasks.length - 1];
          setLastTaskId(lastTask.taskId);
        }
      } catch (error) {
        console.error('Error fetching last task ID:', error);
      }
    };
    fetchLastTaskId();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "taskId") {
      formattedValue = value.replace(/\D/g, '');
      formattedValue = formattedValue.split('').join('.');
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/backlog/${id}/tasks`, formData);
      window.location.href = `/backlog/details/${id}/`;
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError("Task ID already exists");
      } else {
        setError('An error occurred while adding the task.');
      }
    }
  };

  return (
    <div className="m-1 p-4 md:p-16 mx-auto flex flex-col gap-8 md:gap-12">
      <Card className='mx-4 md:mx-36'>
        <CardHeader variant="gradient" color="gray" className="mb-4 md:mb-8 p-4 md:p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            New Task
          </Typography>
          <Link to={`/backlog/details/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody className="p-4 md:p-6 flex justify-center">
          <form onSubmit={handleSubmit} className='w-full md:w-1/2'>
   
            <Input
              placeholder="Task Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mb-4"
              type='text'
            />
            <br />

            <Input
              placeholder={`Task ID format x.x.x`}
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              required
              className="mb-4"
              type='text'
            />
                        {lastTaskId && (
              <Typography variant="subtitle1"color='green' className="mb-1 mt-1 ml-2">
               <b> The Last TaskId Added is : {lastTaskId}</b>
              </Typography>
            )}
            {error && <Typography variant="caption" color="red" className="mb-2 ml-2">{error}</Typography>}
           
            <Input
              placeholder="User Story"
              name="userStory"
              value={formData.userStory}
              onChange={handleChange}
              required
              className="mb-4"
              type='text'
            />
            <br />
            <Input
              placeholder="deadLine"
              name="deadLine"
              value={formData.deadLine}
              onChange={handleChange}
              required
              className="mb-4"
              type='datetime-local'
            />
        
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="pl-1 pr-4 py-2 mt-4 md:mt-5 rounded-lg border border-gray-400 shadow-sm focus:outline-none focus:border-black focus:ring-black w-full"
            >
              <option value="Lowest">Lowest</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Highest">Highest</option>
            </select>
            <Button
              type="submit"
              color="lightBlue"
              ripple="light"
              className="w-full md:w-40 mt-4"
            >
              Add Task
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTask;

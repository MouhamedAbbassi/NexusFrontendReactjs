import React, { useState } from 'react';
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
import { addTaskAsync } from '../../reduxToolkit/reducers/slice';

const AddTask = () => {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const [formData, setFormData] = useState({
    name: '',
    taskId: '',
    userStory: '',
    deadLine: '',
    priority: 'Medium',
  }); // State for form data
  const dispatch = useDispatch(); // Redux dispatch function

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "taskId") { // For taskId input, apply pattern
      formattedValue = value.replace(/\D/g, ''); // Remove non-digit characters
      formattedValue = formattedValue.split('').join('.'); // Add period after each digit
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addTaskAsync({ id, body: formData })); // Dispatch async action to add task
    window.location.href = `/backlog/details/${id}/`; // Redirect to the task details page after adding the task
  };

  return (
    <div className="m-1 p-16 mx-48 flex flex-col gap-12">
      <Card className='mx-36'>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 mx-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="white">
            New Task 
          </Typography>
          <Link to={`/backlog/details/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody style={{display:"flex",justifyContent:"center"}}>
          <form onSubmit={handleSubmit} className='w-1/2'>
            {/* Input fields for task details */}
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
              placeholder="Task id format x.x.x"
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              required
              className="mb-4"
              type='text'
            />
            <br />
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
              className="pl-1 pr-60 py-2 mt-5 rounded-lg border border-gray-400 shadow-sm focus:outline-none focus:border-black focus:ring-black"
              >
             <option value="Lowest">Lowest</option>
             <option value="Low">Low</option>
             <option value="Medium">Medium</option>
             <option value="High">High</option>
             <option value="Highest">Highest</option>
            </select>
            {/* Submit button */}
            <Button
              type="submit"
              color="lightBlue"
              ripple="light"
              className="w-40 mt-2"
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

import React, { useState, useEffect } from 'react';
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

const AddBacklog = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project: '',
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get('http://localhost:3000/backlog/findAllProjectsWithoutBacklog');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:3000/backlog/${formData.project}`, {
        name: formData.name,
        description: formData.description,
      });

      window.location.href = `/dashboard/backlog`;
    } catch (error) {
      console.error('Error adding backlog:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full md:w-2/3 m-1 p-4 md:p-16 mx-auto flex flex-col gap-8 md:gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-4 md:p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            New Backlog
          </Typography>
          <Link to={`/dashboard/backlog`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </Link>
        </CardHeader>
        <CardBody className=" p-4 md:p-6 flex justify-center">
          <form onSubmit={handleSubmit} className='w-full md:w-1/2'>
            <Input
              placeholder="Backlog Name"
              name="name"
              value={formData.name}
              onChange={handleChange} 
              required
              className="mb-4"
              type='text'
            />
            <br />
            <Input
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange} 
              required
              className="mb-4"
              type='text'
            />
            <select
              name="project"
              value={formData.project}
              onChange={handleChange} 
              required
              className="pl-1 pr-4 py-2 mt-5 rounded-lg border border-gray-400 shadow-sm focus:outline-none focus:border-black focus:ring-black w-full"
            >
              <option value="">Select a Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
            <Button
              type="submit"
              color="lightBlue"
              ripple="light"
              className="w-full md:w-40 mt-4"
            >
              Save
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddBacklog;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';

const Backlogs = () => {
  // State variables
  const [backlog, setBacklogs] = useState([]); // Holds the backlog data
  const [openMenuIndex, setOpenMenuIndex] = useState(null); // Track which dropdown menu is open

  // Menu items
  const Menu = ["Backlog Details", "Add Tasks", ""];

  // Fetch backlog data from the server
  useEffect(() => {
    axios.get('http://localhost:3000/backlog')
      .then(response => {
        setBacklogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching backlog:', error);
      });
  }, []);

  // Function to fetch project data for each backlog item
  const getProjectData = async (project) => {
    try {
      const response = await axios.get(`http://localhost:3000/backlog/${project}/project`);
      return response.data.name;
    } catch (error) {
      console.error('Error fetching project data:', error);
      return null;
    }
  };

  // Update project names in the backlog data
  useEffect(() => {
    backlog.forEach(async (backlogItem, index) => {
      backlogItem.projectName = await getProjectData(backlogItem.projects);
      if (index === backlog.length - 1) {
        setBacklogs([...backlog]); // Force re-render
      }
    });
  }, [backlog]);

  // Function to toggle the dropdown menu for a specific row
  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Backlog Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {/* Render table headers */}
                {["Project Name", "Backlog Name", "members", "completion", ""].map(el => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render backlog items */}
              {backlog.map(({ name, projectName }, index) => {
                const isMenuOpen = openMenuIndex === index; // Check if menu is open for this row
                const className = `py-3 px-5 ${
                  index === backlog.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                return (
                  <tr key={index}>
                    {/* Render project name */}
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {projectName}
                        </Typography>
                      </div>
                    </td>
                    {/* Render backlog name */}
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {name}
                        </Typography>
                      </div>
                    </td>
                    {/* Render dropdown menu */}
                    <td className={className}>
                      <Typography
                        as="a"
                        href="#"
                        className="text-xs font-semibold text-blue-gray-600"
                      >
                        {/* EllipsisVerticalIcon to toggle menu */}
                        <EllipsisVerticalIcon
                          onClick={() => handleMenuToggle(index)} // Toggle menu on click
                          strokeWidth={2}
                          className="h-5 w-5 text-inherit cursor-pointer"
                        />
                      </Typography>
                      {/* Render menu if open */}
                      {isMenuOpen && (
                       
                       <ul className="ml-2 pl-1 bg-blue-gray-50 rounded-md border border-blue-gray-100 w-32">
                          {/* Render menu items */}
                          {Menu.map((menu) => (
                            <li
                              
                              key={menu}
                              className="hover:bg-blue-gray-100 rounded-md mr-1 mt-1  cursor-pointer p-1"
                            >
                              {menu}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className={className}>
  <Link to="/backlog/details">
    <button>Backlog Detail</button>
  </Link>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Backlogs;

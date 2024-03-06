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
  const Menu = ["Backlog Details", ""];

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
    
    <div className="mt-12 mb-8 flex flex-col gap-12 mx-6">
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
                {["Project Name", "Backlog Name",  ""].map(el => (
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
              {backlog.map(({ _id,name, projectName }, index) => {
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
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                      </svg>

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
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>
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
                       
                       <ul className="ml-2 pl-1 pt-2 pb-2 bg-blue-gray-50 rounded-md border border-blue-gray-100 w-32">
                          {/* Render menu items */}
                          {Menu.map((menu) => (
                         
                            <Link to={`/backlog/details/${backlog[index]._id}/`}
                              key={menu}
                              className="hover:bg-blue-gray-100 rounded-md mr-1 mt-1  cursor-pointer p-1"
                            >
                              {menu}
                         
                            </Link>
                          ))}
                        </ul>
                      )}
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

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { projectsTableData } from "@/data";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export function Backlogs() {
    const [backlog, setBacklogs] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:3000/backlog')  
        .then(response => {
          setBacklogs(response.data);
          console.log(response.data);

        })
        .catch(error => {
          console.error('Error fetching backlog:', error);
        });
    }, []);
  
  

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
                {["Project Name","Backlog Name", "members", "completion", ""].map(
                  (el) => (
                    <th key={el}className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>

        
            </thead>
            <tbody>      
            {backlog.map(({ id, name }, key) => {
            const className = `py-3 px-5 ${
            key === projectsTableData.length - 1 ? "" : "border-b border-blue-gray-50"
            }`;

        return (
         <tr key={id}>
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
        </tr>
      );
      })}

            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Backlogs;

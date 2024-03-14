import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";

const ModalTasks = ({ open, setOpen, taskId }) => {
  const handleOpen = () => setOpen(!open);
  const [task, setTask] = useState(null);

  useEffect(() => {
    // Fetch task 
    if (taskId) {
      axios.get(`http://localhost:3000/tasks/${taskId}`)
        .then(response => {
          setTask(response.data);
        })
        .catch(error => {
          console.error('Error fetching task:', error);
        });
    }
  }, [taskId]);

  const handleSave = () => {
    // Add save functionality here
    // For example, you can send an API request to update the task
    // After saving, close the modal
    handleOpen();
  };

  return (
    <Dialog open={open} size="xs" handler={handleOpen}>
      <div className="flex items-center justify-between">
        <DialogHeader className="flex flex-col items-start">
          <Typography className="mb-1" variant="h4">
            Task Details
          </Typography>
        </DialogHeader>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-3 h-5 w-5"
          onClick={handleOpen}
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <DialogBody>
        {task && (
          <>
            <Typography className="mb-3 font-bold">Task Name: {task.name}</Typography>
            <Typography className="mb-3 font-bold">Task ID: {task.taskId}</Typography>
             <Typography className="mb-3 font-bold">User Story: {task.userStory}</Typography>
             <Typography className="mb-3 font-bold">Priority: {task.priority}</Typography>
             <Typography className="mb-3 font-bold">Deadline: {task.deadLine}</Typography>
          </>
        )}
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="gray" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="gradient" className="px-9" color="gray" onClick={handleSave}>
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalTasks;

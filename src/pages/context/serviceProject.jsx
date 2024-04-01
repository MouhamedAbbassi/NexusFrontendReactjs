import axiosInstance from '../../configs/axios';
import { createContext, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';

export const GlobalContext = createContext();

export default function WrapperProject({ children }) {
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
 const [errors, setErrors] = useState({});
  const toast = useToast();
const [project, setProject] = useState({});

  const FetchProjects =  () => {
    axiosInstance
      .get('/projects')
     .then((res) => {
        setProjects(res.data);
      })
     .catch ((err) => {
      console.log(err.response.data);
  });
  };

  const Add = async (form, setForm) => {
    try {
      const res = await axiosInstance.post('/projects', form);
      setProjects([...projects, res.data]);
      toast({
        title: 'Project Added',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setForm({});
      onClose();
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  const Search = async (query) => {
    try {
      const res = await axiosInstance.post(`/projects/search?key=${query}`);
      setProjects(res.data);
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  const Delete = async (id) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects(projects.filter((u) => u._id !== id));
      toast({
        title: 'Projects Deleted',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  const FindOne = async (id) => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      setProjects(res.data);
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  const Update = async (form, setForm, id) => {
    axiosInstance
      .put(`/projects/${id}`, form )
      .then(( res ) => {
        toast({
          title: 'Project Updated',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      setErrors({});
        setForm({});
        onClose();
        FetchProjects();
      })
      .catch( ( err ) => {
       setErrors(err.response.data.error);
      });
  };

  const SortByName = async () => {
    try {
      const res = await axiosInstance.get('/projects/sort/name');
      setProjects(res.data);
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        FetchProjects,
        Add,
        projects,
        onOpen,
        isOpen,
        onClose,
        Search,
        Delete,
        FindOne,
        Update,
        setProject,
        project,
        SortByName,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

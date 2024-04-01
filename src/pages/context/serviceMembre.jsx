import { createContext, useState } from 'react';
import axiosInstance from '../../configs/axios';
import { useDisclosure, useToast } from '@chakra-ui/react';

export const GlobalContext = createContext();

export default function WrapperMembers({ children }) {
  const [membres, setMembres] = useState([]);
  const [membre, setMembre] = useState({});
  const [errors, setErrors] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const FetchMembres = () => {
    axiosInstance
      .get('/membres')
      .then((res) => {
        setMembres(res.data);
      })
      .catch((err) => {
        console.log(err.response.data); // Corrected typo: err.response.data
      });
  };

  const Search = (query) => {
    axiosInstance
      .post(`/membres/search?key=${query}`)
      .then((res) => {
        setMembres(res.data);
      })
      .catch((err) => {
        console.log(err.response.data); // Corrected typo: err.response.data
      });
  };

  const Delete = (id) => {
    axiosInstance
      .delete(`/membres/${id}`)
      .then((res) => {
        setMembres(membres.filter((u) => u._id !== id)); // Fixed !== operator
        toast({
          title: 'User Deleted',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err.response.data); // Corrected typo: err.response.data
      });
  };

  const Add = (form, setForm) => {
    axiosInstance
      .post('/membres', form)
      .then((res) => {
        setMembres([...membres, res.data]);
        toast({
          title: 'membre Added',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setErrors({});
        setForm({});
        onClose();
      })
      .catch((err) => {
        setErrors(err.response.data.error);
      });
  };

  const FindOne = async (id) => {
    await axiosInstance
      .get(`/membres/${id}`)
      .then((res) => {
        setMembre(res.data);
      })
      .catch((err) => {
        setErrors(err.response.data.error);
      });
  };

  const Update = (form, setForm, id) => {
    axiosInstance
      .put(`/membres/${id}`, form)
      .then((res) => {
        toast({
          title: 'Member Updated',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setErrors({});
        setForm({});
        onClose();
        FetchMembres();
      })
      .catch((err) => {
        setErrors(err.response.data.error);
      });
  };

  const SortByName = () => {
    axiosInstance
      .get('/membres/sort/name')
      .then((res) => {
        setMembres(res.data);
      })
      .catch((err) => {
        console.log(err.response.data); // Corrected typo: err.response.data
      });
  };

  return (
    <GlobalContext.Provider
      value={{
        FetchMembres,
        Search,
        Delete,
        Add,
        FindOne,
        Update,
        membres,
        onOpen,
        isOpen,
        onClose,
        errors,
        setErrors,
        membre,
        setMembre,
        SortByName,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

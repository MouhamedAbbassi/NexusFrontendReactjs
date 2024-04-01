import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
 Stack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../pages/context/serviceMembre';
import InputsGroup from './Inputs';

export default function DrawerExample() {
  
    const { isOpen, onClose, Add, errors, setErrors, membre, Update } = useContext(GlobalContext) || {};


  const [form, setForm] = useState({});
  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onAdd = () => {
    Add(form, setForm);
  };

  const onUpdate = () => {
    Update(form, setForm, form._id);
  };

  useEffect(() => {
    setForm(membre);
  }, [membre]);
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            onClick={() => {
              onClose();
              setErrors({});
              setForm({});
            }}
          />
          <DrawerHeader>Create / Update membre</DrawerHeader>

          <DrawerBody>
            <Stack spacing={'24px'}>
              <InputsGroup
                name="name"
                onChangeHandler={onChangeHandler}
                value={form?.name}
                errors={errors?.name}
              />
              <InputsGroup
                name="email"
                onChangeHandler={onChangeHandler}
                value={form?.email}
                errors={errors?.email}
              />
              <InputsGroup
                name="phone"
                onChangeHandler={onChangeHandler}
                value={form?.phone}
                errors={errors?.phone}
              />
              
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
                setErrors({});
                setForm({});
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => (form._id ? onUpdate() : onAdd())}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

import { useContext } from 'react';

import {UserContext} from './userContext'

export default function useUser() {
    const { user, updateUser, clearUser } = useContext(UserContext);

    return { user, updateUser, clearUser };
}

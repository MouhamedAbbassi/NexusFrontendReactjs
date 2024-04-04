import axios from "axios"


export const getTasks = () => {
    return axios.get(`http://localhost:3000/tasks`)
}


export const getBacklog = () => {
    return axios.get(`http://localhost:3000/backlog`)
}


export const getTasksById = (id) => {
    return axios.get(`http://localhost:3000/tasks/${id}`)
}

export const addTask = (id,body) => {
    return axios.post(`http://localhost:3000/backlog/${id}/tasks`,body)
}

export const deleteTask = (id) => {
    return axios.delete(`http://localhost:3000/tasks/${id}`)
}

export const wakaTime = () => {
    return axios.get(`https://wakatime.com/api/v1/users/current`)
}
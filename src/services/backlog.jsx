import axios from "axios"


export const getProjects = () => {
    return axios.get(`http://localhost:3000/backlog/allProjects`)
}


export const getBacklog = () => {
    return axios.get(`http://localhost:3000/backlog/${projectId}`)
}

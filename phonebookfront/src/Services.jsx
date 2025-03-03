import axios from 'axios';

//const baseUrl = '/api/persons'; 
//const baseUrl = '/api/persons'; // Relative path

//const baseUrl = 'http://localhost:3001/api/persons'; // Update to backend URL
const baseUrl = import.meta.env.VITE_BACKEND_URL || '/api/persons';

const getAll = () => axios.get(baseUrl).then(response => response.data);

const create = newPerson => axios.post(baseUrl, newPerson).then(response => response.data);

const remove = id => axios.delete(`${baseUrl}/${id}`).then(response => response.data);

export default { getAll, create, remove };

//const baseUrl =  '/api/persons';
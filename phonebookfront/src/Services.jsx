import axios from 'axios';

const baseUrl = 'https://part3-er3c.onrender.com/api/persons'; 
//const baseUrl = import.meta.env.VITE_BACKEND_URL || '/api/persons';

const getAll = () => axios.get(baseUrl).then(response => response.data);

const create = newPerson => axios.post(baseUrl, newPerson).then(response => response.data);

const remove = id => axios.delete(`${baseUrl}/${id}`).then(response => response.data);

export default { getAll, create, remove };

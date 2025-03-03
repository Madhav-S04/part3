
//const baseUrl = '/api/persons'; 
//const baseUrl = '/api/persons'; // Relative path

//const baseUrl = 'http://localhost:3001/api/persons'; // Update to backend URL
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL || '/api/persons';

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error.response?.data?.error || error.message);
      throw error;
    });
};

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data)
    .catch(error => {
      console.error('Error creating person:', error.response?.data?.error || error.message);
      throw error; // Ensure the error propagates to the frontend
    });
};

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating person:', error.response?.data?.error || error.message);
      throw error;
    });
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting person:', error.response?.data?.error || error.message);
      throw error;
    });
};

export default { getAll, create, update, remove };


//const baseUrl =  '/api/persons';
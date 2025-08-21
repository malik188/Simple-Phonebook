import axios from "axios";
const baseUrl = "/persons";

// Function to fetch all persons from the server
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// Function to create a new person on the server
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

// Updates an existing person's phone number on the server
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

// Deletes a person from the server by ID
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => {
    response.data;
  });
};

export default {
  getAll,
  create,
  update,
  deletePerson,
};

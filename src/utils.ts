import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const apiPost = async (endpoint: string, data: any) => {
  try {
    return await axios.post(`${apiUrl}${endpoint}`, data);
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

export const apiGet = async (endpoint: string) => {
  try {
    return await axios.get(`${apiUrl}${endpoint}`);
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    throw error;
  }
};

export const apiDelete = async (endpoint: string) => {
  try {
    return await axios.delete(`${apiUrl}${endpoint}`);
  } catch (error) {
    console.error(`Error in DELETE ${endpoint}:`, error);
    throw error;
  }
};

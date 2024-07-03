import axios from "axios";
import { BACKEND_URL } from "../constant";
export const login = async(data)=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`,data);
        return response.data;
    }catch(error){
        return error.response.data;
    }
    
};

export const Registeruser = async(data)=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/register`,data);
        return response.data;
    }catch(error){
        return error.response.data;
    }
    
};

export const fetchUserData = async (userId, token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/userdata/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };




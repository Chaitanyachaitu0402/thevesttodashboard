// src/api/user.js

import axiosInstance from '../utils/axiosInstance';

export const getUserData = async () => {
  const response = await axiosInstance.get('/user');
  return response.data;
};

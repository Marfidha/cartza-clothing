import axios from "axios";

const API = axios.create({
  baseURL: "https://cartza-clothing.onrender.com"
});

export default API;
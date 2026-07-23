import axios from "axios";

const API = axios.create({
    baseURL: "https://placementmanagement.onrender.com/api"
});

export default API;
import axios from "axios";

const API = axios.create({
    baseURL: "https://placementmanagement.onrender.com"
});

export default API;
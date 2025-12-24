import axios from 'axios';
const api = axios.create({
    baseURL: "https://resume-builder-backend-pmtk.onrender.com"
})

export default api; 

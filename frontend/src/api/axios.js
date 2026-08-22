import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// const API = axios.create({
//   baseURL: "https://vendor-verse-e-com-web-application.vercel.app/",
// });

API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);

      if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
    }
  }

  return req;
});

export default API;
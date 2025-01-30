import axios from "axios";

const api = axios.create({
  baseURL: "http://api.weatherapi.com/v1/",
  params: {
    key: "5a5934b1bd3245f48b8112205252601",
  },
});
// const api = axios.create({
//   baseURL: "https://api.openweathermap.org/data/2.5/",
//   params: {
//     appid: "48d4a08c66d9bbd0b340cf8397294320",
//     units: "metric",
//   },
// });

export default api;

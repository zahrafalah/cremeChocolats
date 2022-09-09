import axios from "./axios";

import { API_URL } from "./../config/keys";

const dashTrackApi = axios({
  baseURL: API_URL,
});

export default dashTrackApi;

import axios from "axios";

axios.defaults.baseURL = "http://mbwass.com:5000";

export { axios as request };

import axios from "axios"
import store from "@/store";

const authAxios = axios.create({
});

authAxios.interceptors.request.use(config => {
    config.headers.Authorization = store.state.authToken;
    return config
})

export default authAxios;
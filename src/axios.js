import axios from "axios";
import Element from "element-ui";
import store from "./store/store";
import router from "./router/router";

axios.defaults.baseURL="http://localhost:8090"

//前置拦截
axios.interceptors.request.use(config => {
    return config
})

//后置拦截
axios.interceptors.response.use(response => {
    let res = response.data
    console.log("interceptors response status:"+response.status)
    if (response.status === 200) {
        if (res.code !== undefined) {
            if (res.code === "200") {
                return response;
            } else {
                Element.Message.error(res.msg, {duration: 3 * 1000});
                return Promise.reject(res.msg);
            }
        } else {
            return response;
        }
    } else {
        Element.Message.error(res.msg, {duration: 3 * 1000});
        return Promise.reject(res.msg);
    }
}, error => {
    if (error.response.data) {
        error.message = error.response.data.msg
    }
    if (error.response.status === 401 ) { //无权限，remove token
        store.commit("REMOVE_INFO")
        router.push("/login")
    }
    Element.Message.error(error.message , {duration:3*1000})
    return Promise.reject(error.message)
})
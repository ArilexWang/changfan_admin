import axios from 'axios';

let base = '';

let host = 'https://yixiuge.xyz/scavenger/';
var instance = axios.create({
    headers: {
        'Content-type': 'application/json'
    }
})

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {
        params: params
    });
};

export const getUserListPage = params => {
    return axios.get(`${base}/user/listpage`, {
        params: params
    });
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {
        params: params
    });
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {
        params: params
    });
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {
        params: params
    });
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, {
        params: params
    });
};

export const getVillaByKey = params => {
    return instance.get("https://ferrariwang.cn/mini-program/searchVillaCityRegionByName");
};

export const getVillaInfoById = params => {
    return instance.post('http://118.25.6.157:8686/homeparty/manage/getVillaInfoById', {
        params: params
    });
};

export const getAllVillas = params => {
    return instance.get('http://118.25.6.157:8686/homeparty/manage/getAllVillas');
};

export const getAllBrands = params => {
    console.log(host)
    return instance.get(host + "getAllElectronicsBrand/");
};

export const getAllMalfunctionCategory = params => {
    return instance.get(host + "getAllMalfunctionCategory/");
};

export const setElectronicsBrand = params => {
    console.log(params);
    return axios.post(host + "setElectronicsBrand/", {
        params: params
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const getAllMalfunctionDetail = params => {
    return instance.get(host+"getAllMalfunctionDetail/");
};

export const getAllOrder = params => {
    return instance.get(host+"getAllOrder/");
};
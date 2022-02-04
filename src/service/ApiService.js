import { API_BASE_URL } from "../app-config";
import axios from "axios";

export function call(api, method, request) {
    let headers = {
        "Content-Type": "application/json",
    };

    // 로컬 스토리지에서 ACCESS_TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken;
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
        data: request
    };

    return axios(options)
        .then((response) => {
            console.log(response);
            if (response.status !== 200) {
                throw response;
            } else {
                return response;
            }
        })
        .catch((error) => {
            // 추가된 부분
            console.log(error);
            if (error.status === 403) {
                // window.location.href = "/login"; // redirect
                // <Redirect to="login" />
            }
            return Promise.reject(error);
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            // console.log("response: ", response);
            // alert("로그인 토큰: " + response.token)
            if (response.data.token) {
                // 로컬 스토리지에 토큰 저장
                localStorage.setItem("ACCESS_TOKEN", response.data.token);
                // token이 존재하는 경우 Todo 화면으로 리디렉트
                return response;
                // window.location.href = "/practice_todo_react_app/";
            }
        });
}

export function signout() {
    localStorage.setItem("ACCESS_TOKEN", null);
    // window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO)
}
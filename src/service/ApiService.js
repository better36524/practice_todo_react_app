import { API_BASE_URL } from "../app-config";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    // 로컬 스토리지에서 ACCESS_TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
        headers.append("Authorization", "Bearer " + accessToken);
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
    };
    
    if (request) {
        // GET method
        options.body = JSON.stringify(request);
    }

    return fetch(options.url, options)
        .then((response) => {
            if (!response.ok) {
                throw response;
            } else {
                return response.json();
            }
        })
        .catch((error) => {
            // 추가된 부분
            console.log(error.status);
            if (error.status === 403) {
                window.location.href = "/practice_todo_react_app/login"; // redirect
            }
            return Promise.reject(error);
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            // console.log("response: ", response);
            // alert("로그인 토큰: " + response.token)
            if (response.token) {
                // 로컬 스토리지에 토큰 저장
                localStorage.setItem("ACCESS_TOKEN", response.token);
                // token이 존재하는 경우 Todo 화면으로 리디렉트
                window.location.href = "/practice_todo_react_app/";
            }
        });
}

export function signout() {
    localStorage.setItem("ACCESS_TOKEN", null);
    window.location.href = "/practice_todo_react_app/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO)
}
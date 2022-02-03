let backendHost;

const hostname = window && window.location && window.location.hostname;

// if (hostname === "localhost") {
//     backendHost = "http://localhost:8080";
// } else {
    backendHost = "https://better36524.herokuapp.com";
// }

export const API_BASE_URL = `${backendHost}`;
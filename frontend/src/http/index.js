import axios from "axios"

const api = axios.create({
    baseURL : "https://coderhouse-nw8l.onrender.com",
    withCredentials : true,
    headers : {
        "Content-Type" : "application/json",
        Accept : "application/json"
    }
})

export const sendOtpEmail = async (data) => {
    try {
        const response = await api.post("/api/send-otp-email", data);
        return response;
    } catch (error) {
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        throw error; 
    }
}

export const sendOtpPhone = async (data) => {
    try {
        const response = await api.post("/api/send-otp-phone", data);
        return response;
    } catch (error) {
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        throw error; 
    }
}

export const verifyOtp = async (data) => {
    try {
        const response = await api.post("/api/verify-otp", data);
        return response;
    } catch (error) {
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const activate = async (data) => {
    try {
        const response = await api.post("/api/activate", data);
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const logout = () => {
    try {
        const response = api.post("/api/logout");
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const createRoom = (data) => {
    try {
        const response = api.post("/api/rooms", data);
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}


export const getAllRooms = () => {
    try {
        const response = api.get("/api/rooms");
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const getRoom = (roomId) => {
    try {
        const response = api.get(`/api/rooms/${roomId}`);
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const searchRoom = (data) => {
    try {
        const response = api.post("/api/room/search", data);
        return response;
    } catch (error) {
        console.error("Error sending activate data:", error.response ? error.response.data : error.message);
        throw error;
    }
}


//interceptors
//like middlewares in backend
api.interceptors.response.use((config) => {return config}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && originalRequest && !originalRequest._isRetry){
        originalRequest.isRetry = true;
        try{
            await axios.get("https://coderhouse-nw8l.onrender.com/api/refresh", {
                withCredentials : true
            })
            return api.request(originalRequest);
        }catch(err){
            console.log(err.message)
        }
    }
    throw error;
})









export default api;
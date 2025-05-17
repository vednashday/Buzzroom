import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
};

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
    try{
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    }catch(error){
        console.log("Error in getAuthUser: ",error);
        return null;
    }
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}


export async function getUserFriends() {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export async function getoutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}
export async function sendFriendRequest(userId) {
    try {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Friend request error:", error.response?.data || error.message);
    throw error;
  }
}


export const searchUsers = async (query) => {
  const res = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search users');
  return res.json();
};

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}


export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
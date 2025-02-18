import axios from "axios";
import { renderMessagePopup } from "./render";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => refreshSubscribers.push(callback);

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.replace("/login?message=login_again");
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (!error.response) {
      renderMessagePopup("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const { status, config, data } = error.response;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await apiClient.post("/users/refresh-access-token");
          isRefreshing = false;
          onTokenRefreshed();
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          handleLogout();
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          apiClient.request(config).then(resolve).catch(reject);
        });
      });
    }

    renderMessagePopup(data?.message || "An unexpected error occurred.");
    return Promise.reject(error);
  }
);

// API Services

export const TodoService = {
  fetchTodos: () => apiClient.get("/todos"),
  addTodo: (text, dueTime) => apiClient.post("/todos/add", { text, dueTime }),
  updateTodo: (id, text, dueTime) =>
    apiClient.put(`/todos/update/${id}`, { text, dueTime }),
  toggleTodoStatus: (id, status) =>
    apiClient.patch(`/todos/status/${id}`, { status }),
  deleteTodo: (id) => apiClient.delete(`/todos/delete/${id}`),
};

export const AuthService = {
  registerUser: (name, email, password) =>
    apiClient.post("/users/register", { name, email, password }),
  loginUser: (email, password) =>
    apiClient.post("/users/login", { email, password }),
  logoutUser: () => apiClient.post("/users/logout"),
  deleteUser: (password) =>
    apiClient.delete("/users/delete", { data: { password } }),
};

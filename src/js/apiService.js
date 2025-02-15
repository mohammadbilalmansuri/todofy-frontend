import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Track token refresh state
let isRefreshing = false;
let refreshSubscribers = [];

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      return handle401AndRetry(error);
    }
    return Promise.reject(processError(error));
  }
);

async function handle401AndRetry(error) {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await refreshAccessToken();
      isRefreshing = false;
      notifySubscribers();
    } catch (refreshError) {
      isRefreshing = false;
      clearSession();
      return Promise.reject(refreshError);
    }
  }

  return new Promise((resolve, reject) => {
    refreshSubscribers.push(() => {
      apiClient(error.config).then(resolve).catch(reject);
    });
  });
}

async function refreshAccessToken() {
  try {
    await apiClient.patch("/users/refresh-access-token");
  } catch (error) {
    throw new Error("Session expired. Please log in again.");
  }
}

function notifySubscribers() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

function clearSession() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}

function processError(error) {
  if (error.response) {
    return new Error(error.response.data?.message || "Something went wrong");
  } else if (error.request) {
    return new Error("Network error. Please check your connection.");
  } else {
    return new Error(error.message);
  }
}

// ======= Todo Services =======

export const TodoService = {
  fetchTodos: () => apiClient.get("/todos"),
  addTodo: (title, description, dueTime) =>
    apiClient.post("/todos/add", { title, description, dueTime }),
  updateTodo: (id, title, description, dueTime) =>
    apiClient.put(`/todos/update/${id}`, { title, description, dueTime }),
  toggleTodoStatus: (id, status) =>
    apiClient.patch(`/todos/status/${id}`, { status }),
  deleteTodo: (id) => apiClient.delete(`/todos/delete/${id}`),
};

// ======= Auth Services =======

export const AuthService = {
  registerUser: (name, email, password) =>
    apiClient.post("/users/register", { name, email, password }),
  loginUser: (email, password) =>
    apiClient.post("/users/login", { email, password }),
  logoutUser: () =>
    apiClient.post("/users/logout").finally(() => {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }),
  deleteUser: (password) =>
    apiClient.delete("/users/delete", { data: { password } }),
};

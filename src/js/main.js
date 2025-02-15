import { darkMode, user, setTheme } from "./state.js";
import {
  togglePasswordVisibility,
  handleQueryParamsAndPopups,
  loadSavedConfig,
  fetchTodos,
} from "./utils.js";
import { renderUserConfirmation } from "./render.js";
import {
  handleLogin,
  handleRegister,
  handleAddEditTodo,
  handleLogout,
  handleDeleteUser,
  setupTodoEventListeners,
} from "./handlers.js";

window.addEventListener("DOMContentLoaded", async () => {
  handleQueryParamsAndPopups();
  loadSavedConfig();
  document
    .querySelector(".theme-btn")
    ?.addEventListener("click", () => setTheme(!darkMode));

  if (user) {
    await fetchTodos();
    setupTodoEventListeners();

    const handleBodyClick = (e) => {
      if (!e.target.closest(".logout, .delete-account, .add-todo")) return;

      if (e.target.closest(".logout")) {
        renderUserConfirmation("Do you want to logout?", () => {
          handleLogout();
        });
      } else if (e.target.closest(".delete-account")) {
        handleDeleteUser();
      } else if (e.target.closest(".add-todo")) {
        handleAddEditTodo();
      }
    };

    document.body.removeEventListener("click", handleBodyClick);
    document.body.addEventListener("click", handleBodyClick);
  } else {
    const eye = document.querySelector(".eye");
    eye?.addEventListener("click", () => {
      togglePasswordVisibility(eye);
    });

    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin);
    document
      .getElementById("register-form")
      ?.addEventListener("submit", handleRegister);
  }
});

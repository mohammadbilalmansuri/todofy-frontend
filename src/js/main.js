import { darkMode, user, setTheme, initializeTheme } from "./state.js";
import { handleRedirections, handleQueryMessages } from "./router.js";
import { renderUserConfirmation } from "./render.js";
import {
  handlePasswordToggleEye,
  handleLogin,
  handleRegister,
  handleLogout,
  handleDeleteUser,
  handleAddEditTodo,
  handleTodosInitialization,
} from "./handlers.js";

window.addEventListener("DOMContentLoaded", async () => {
  initializeTheme();
  handleRedirections();
  handleQueryMessages();

  document
    .querySelector(".theme-btn")
    ?.addEventListener("click", () => setTheme(!darkMode));

  if (user) {
    await handleTodosInitialization();

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".logout")) {
        renderUserConfirmation("Do you want to logout?", handleLogout);
      } else if (e.target.closest(".delete-account")) {
        handleDeleteUser();
      } else if (e.target.closest(".add-todo")) {
        handleAddEditTodo();
      }
    });
  } else {
    const eye = document.querySelector(".eye");
    eye?.addEventListener("click", () => handlePasswordToggleEye(eye));

    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin);
    document
      .getElementById("register-form")
      ?.addEventListener("submit", handleRegister);
  }
});

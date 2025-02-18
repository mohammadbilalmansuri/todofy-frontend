import { setUser } from "./state.js";
import { renderMessagePopup } from "./render.js";

export const handleRedirections = () => {
  const currentRoute = window.location.pathname;
  const allowedRoutes = ["/", "/login", "/register", "/dashboard"];
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!storedUser;

  if (!allowedRoutes.includes(currentRoute)) {
    window.location.replace(isLoggedIn ? "/dashboard" : "/");
    return;
  }

  if (!isLoggedIn && currentRoute === "/dashboard") {
    return window.location.replace("/login?message=login_required");
  }

  if (isLoggedIn && ["/login", "/register", "/"].includes(currentRoute)) {
    return window.location.replace("/dashboard?message=logged_in");
  }

  if (isLoggedIn) setUser(storedUser);
};

export const handleQueryMessages = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get("message");
  const currentRoute = window.location.pathname;

  const routeMessageMap = {
    "/login": [
      "login_required",
      "logged_out",
      "account_deleted",
      "login_again",
    ],
    "/dashboard": ["login_success", "account_success", "logged_in"],
  };

  const messages = {
    login_required: "Please login to access the dashboard",
    logged_out: "Logged out successfully",
    account_deleted: "Account deleted successfully",
    login_again: "Please login again",
    login_success: "Logged in successfully",
    account_success: "Account created successfully",
    logged_in: "You are already logged in",
  };

  if (routeMessageMap[currentRoute]?.includes(message) && messages[message]) {
    renderMessagePopup(messages[message]);
  }

  window.history.replaceState(
    null,
    "",
    window.location.origin + window.location.pathname
  );
};

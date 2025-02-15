import {
  todos,
  setUser,
  addOrUpdateTodo,
  deleteTodo,
  getTodo,
} from "./state.js";
import { AuthService, TodoService } from "./apiService.js";
import Validation from "./validation.js";
import { renderMessagePopup, renderTodos } from "./render.js";

export const handleLogin = async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  if (!Validation.isEmailValid(email)) {
    form.email.focus();
    renderMessagePopup("Invalid email");
    return;
  }

  if (!Validation.isPasswordValid(password)) {
    form.password.focus();
    renderMessagePopup(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    const response = await AuthService.loginUser(email, password);
    if (!response.success) throw new Error(response.message);
    setUser(response.data.user);
    form.reset();
    window.location.href = "/dashboard?message=login_success";
  } catch (error) {
    renderMessagePopup(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
};

export const handleRegister = async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  if (!Validation.isNameValid(name)) {
    form.name.focus();
    renderMessagePopup("Name must be at least 3 characters long");
    return;
  }

  if (!Validation.isEmailValid(email)) {
    form.email.focus();
    renderMessagePopup("Invalid email");
    return;
  }

  if (!Validation.isPasswordValid(password)) {
    form.password.focus();
    renderMessagePopup(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }

  const registerSubmitBtn = form.querySelector("button[type='submit']");
  registerSubmitBtn.disabled = true;
  registerSubmitBtn.textContent = "Processing...";

  try {
    const registerResponse = await AuthService.registerUser(
      name,
      email,
      password
    );
    if (!registerResponse.success) throw new Error(registerResponse.message);
    const loginResponse = await AuthService.loginUser(email, password);
    if (!loginResponse.success) throw new Error(loginResponse.message);
    setUser(loginResponse.data.user);
    form.reset();
    window.location.href = "/dashboard?message=account_success";
  } catch (error) {
    renderMessagePopup(error.message);
  } finally {
    registerSubmitBtn.disabled = false;
    registerSubmitBtn.textContent = "Register";
  }
};

export const handleLogout = async () => {
  try {
    const logoutResponse = await AuthService.logoutUser();
    if (!logoutResponse.success) throw new Error(logoutResponse.message);
    setUser(null);
    window.location.href = "/login?message=logged_out";
  } catch (error) {
    renderMessagePopup(error.message);
  }
};

export const handleDeleteTodo = async (todoId) => {
  try {
    const deleteTodoResponse = await TodoService.deleteTodo(todoId);
    if (!deleteTodoResponse.success)
      throw new Error(deleteTodoResponse.message);

    deleteTodo(todoId);
    renderTodos(todos);
  } catch (error) {
    renderMessagePopup(error.message);
  }
};

export const handleDeleteUser = () => {
  const popupContainer = document.createElement("div");
  popupContainer.className = "popup-container";

  const form = document.createElement("form");
  form.id = "delete-account-form";
  form.classList.add("box");

  form.innerHTML = `
  <h2 class="main-heading">Delete Account</h2>
  <div class="w-full relative flex items-center">
    <input
      name="password"
      type="password"
      placeholder="Confirm your password"
      class="input pr-10"
      required
    />
    <button type="button" class="eye">
      <svg viewBox="0 0 576 512">
        <path
          d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
        />
      </svg>
    </button>
  </div>
  <div class="w-full flex gap-4">
    <button type="submit" class="w-full orange-btn-2 submit">Delete</button>
    <button type="button" class="w-full cancel gray-btn-2">Cancel</button>
  </div>
`;

  const removePopup = () => {
    form.removeEventListener("submit", handleSubmit);
    popupContainer.removeEventListener("click", handlePopupClose);
    clearTimeout(popupContainer.timeoutId);
    popupContainer.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = form.password.value;

    if (!Validation.isPasswordValid(password)) {
      form.password.focus();
      renderMessagePopup(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
      const deleteUserResponse = await AuthService.deleteUser(password);
      if (!deleteUserResponse.success) {
        throw new Error(deleteUserResponse.message);
      }
      setUser(null);
      form.reset();
      window.location.href = "/login?message=account_deleted";
    } catch (error) {
      renderMessagePopup(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Delete";
    }
  };

  const handlePopupClick = (e) => {
    if (e.target.closest(".cancel") || !e.target.closest(".box")) {
      removePopup();
    } else if (e.target.closest(".eye")) {
      togglePasswordVisibility(e.target.closest(".eye"));
    }
  };

  const existingPopup = document.querySelector(".popup-container");
  if (existingPopup) {
    existingPopup
      .querySelector("form")
      .removeEventListener("submit", handleSubmit);
    existingPopup.removeEventListener("click", handlePopupClick);
    clearTimeout(existingPopup.timeoutId);
    existingPopup.remove();
  }

  document.body.appendChild(popupContainer);
  popupContainer.appendChild(form);
  form.addEventListener("submit", handleSubmit);
  popupContainer.addEventListener("click", handlePopupClick);
  popupContainer.timeoutId = setTimeout(removePopup, 60000);
};

export const handleAddEditTodo = (todo) => {
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const form = document.createElement("form");
  form.classList.add("box");

  form.innerHTML = `
  <h2 class="main-heading">${todo ? "Edit Task" : "Add New Task"}</h2>
  <div class="w-full relative flex flex-col gap-1 items-start">
    <label for="todoTitle" class="label">Title <span class="text-orange">*</span></label>
    <input id="todoTitle" name="todoTitle" type="text" placeholder="Enter task title" class="input" value="${
      todo?.title || ""
    }" required />
  </div>
  <div class="w-full relative flex flex-col gap-1 items-start">
    <label for="todoDescription" class="label">Description</label>
    <textarea id="todoDescription" name="todoDescription" placeholder="Enter task description" class="input h-full min-h-20" rows="2" maxlength="1000">${
      todo?.description || ""
    }</textarea>
  </div>
  <div class="w-full relative flex flex-col gap-1 items-start">
    <label for="todoDueDate" class="label">Due Date and Time <span class="text-orange">*</span></label>
    <input id="todoDueDate" name="todoDueDate" type="datetime-local" class="input uppercase" value="${
      todo?.dueTime || ""
    }" required />
  </div>
  <div class="w-full flex gap-4">
    <button type="submit" class="w-full orange-btn-2">${
      todo ? "Update" : "Add"
    }</button>
    <button type="button" class="w-full cancel-btn gray-btn-2">Cancel</button>
  </div>
`;

  const removePopup = () => {
    form.removeEventListener("submit", handleFormSubmit);
    popupContainer.removeEventListener("click", handlePopupClose);
    clearTimeout(popupContainer.timeoutId);
    popupContainer.remove();
  };

  const handlePopupClose = (e) => {
    if (e.target.closest(".cancel-btn") || !e.target.closest(".box"))
      removePopup();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const title = form.todoTitle.value;
    const description = form.todoDescription.value;
    const dueTime = form.todoDueDate.value;

    if (!Validation.isTitleValid(title)) {
      form.title.focus();
      renderMessagePopup("Title must be less than 100 characters.");
      return;
    }

    if (!Validation.isDescriptionValid(description)) {
      form.description.focus();
      renderMessagePopup("Description must be less than 200 characters.");
      return;
    }

    if (!Validation.isDueTimeValid(dueTime)) {
      form.dueDate.focus();
      renderMessagePopup(
        "Invalid due date and time format (YYYY-MM-DDTHH:MM)."
      );
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
      const response = await (todo
        ? TodoService.updateTodo(todo._id, title, description, dueTime)
        : TodoService.addTodo(title, description, dueTime));
      if (!response.success) throw new Error(response.message);
      addOrUpdateTodo(response.data);
      renderTodos(todos);
      removePopup();
    } catch (error) {
      renderMessagePopup(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = todo ? "Update" : "Add";
    }
  };

  const existingPopup = document.querySelector(".popup-container");
  if (existingPopup) {
    existingPopup
      .querySelector("form")
      .removeEventListener("submit", handleFormSubmit);
    existingPopup.removeEventListener("click", handlePopupClose);
    clearTimeout(existingPopup.timeoutId);
    existingPopup.remove();
  }

  document.body.appendChild(popupContainer);
  popupContainer.appendChild(form);
  form.addEventListener("submit", handleFormSubmit);
  popupContainer.addEventListener("click", handlePopupClose);
  popupContainer.timeoutId = setTimeout(removePopup, 60000);
};

export const handleToggleTodoStatus = async (todoId, status, targetBtn) => {
  if (typeof status !== "boolean") {
    renderMessagePopup("Invalid status parameter");
    return;
  }

  targetBtn.innerHTML = `<svg viewBox="0 0 512 512" class="animate-spin"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`;
  targetBtn.disabled = true;

  try {
    const response = await TodoService.toggleTodoStatus(todoId, status);
    if (!response.success) throw new Error(response.message);
    addOrUpdateTodo(response.data);
    // renderTodos(todos);
    status = response.data.status;
  } catch (error) {
    renderMessagePopup(error.message);
  } finally {
    targetBtn.disabled = false;
  }

  targetBtn.innerHTML = status
    ? `<svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`
    : `<svg viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`;
};

export const setupTodoEventListeners = () => {
  const todosContainer = document.querySelector("#todos");

  const handleTodoClick = async (e) => {
    const target = e.target.closest(".todo");
    if (!target) return;

    const todoId = target.id.split("-")[1];
    const todo = getTodo(todoId);
    if (e.target.closest(".status")) {
      const targetBtn = e.target.closest(".status");
      await handleToggleTodoStatus(todoId, !todo.status, targetBtn);
    } else if (e.target.closest(".edit")) {
      handleAddEditTodo(todo);
    } else if (e.target.closest(".delete")) {
      renderUserConfirmation("Do you want to delete this todo?", () =>
        handleDeleteTodo(todoId)
      );
    }
  };

  todosContainer.removeEventListener("click", handleTodoClick);
  todosContainer.addEventListener("click", handleTodoClick);
};

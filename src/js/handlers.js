import {
  todos,
  setUser,
  addOrUpdateTodo,
  deleteTodo,
  getTodo,
  setTodos,
} from "./state.js";
import { AuthService, TodoService } from "./apiService.js";
import validate from "./validation.js";
import {
  renderMessagePopup,
  renderTodos,
  renderUserConfirmation,
} from "./render.js";

export const handlePasswordToggleEye = (eye) => {
  const passwordInput = eye.previousElementSibling;
  const isPasswordType = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPasswordType ? "text" : "password");
  eye.innerHTML = isPasswordType
    ? `<svg viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>`
    : `<svg viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>`;
};

export const handleLogin = async (e) => {
  e.preventDefault();
  const form = e.target;
  const validatedData = validate(form, ["email", "password"]);
  if (!validatedData) return;
  const { email, password } = validatedData;

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg viewBox="0 0 512 512" class="animate-spin size-4.5 fill-white"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`;

  try {
    const response = await AuthService.loginUser(email, password);
    setUser(response.data.user);
    window.location.replace("/dashboard?message=login_success");
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
};

export const handleRegister = async (e) => {
  e.preventDefault();
  const form = e.target;
  const validatedData = validate(form, ["name", "email", "password"]);
  if (!validatedData) return;
  const { name, email, password } = validatedData;

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg viewBox="0 0 512 512" class="animate-spin size-4.5 fill-white"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`;

  try {
    await AuthService.registerUser(name, email, password);
    const loginResponse = await AuthService.loginUser(email, password);
    setUser(loginResponse.data.user);
    window.location.replace("/dashboard?message=account_success");
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
  }
};

export const handleLogout = async () => {
  try {
    await AuthService.logoutUser();
    setUser(null);
    window.location.replace("/login?message=logged_out");
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  }
};

export const handleDeleteUser = () => {
  let existingPopup = document.querySelector(".popup-container");
  if (existingPopup) {
    clearTimeout(existingPopup.timeoutId);
    existingPopup.querySelector("form").remove();
    existingPopup.remove();
  }

  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const form = document.createElement("form");
  form.classList.add("box", "max-w-md");

  form.innerHTML = `
    <h2 class="main-heading md:pb-2 pb-1">Delete Account</h2>
    
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
      <button type="submit" class="w-full btn-lg btn-orange">Delete</button>
      <button type="button" class="w-full cancel btn-lg btn-gray">Cancel</button>
    </div>
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedData = validate(form, ["password"]);
    if (!validatedData) return;
    const { password } = validatedData;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg viewBox="0 0 512 512" class="animate-spin size-4.5 fill-white">
      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM304 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
    </svg>`;

    try {
      await AuthService.deleteUser(password);
      setUser(null);
      window.location.replace("/login?message=account_deleted");
    } catch (error) {
      renderMessagePopup(error.response?.data?.message || error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Delete";
    }
  };

  const removePopup = () => {
    clearTimeout(popupContainer.timeoutId);
    form.removeEventListener("submit", handleSubmit);
    form.removeEventListener("click", handlePopupClick);
    popupContainer.remove();
  };

  const handlePopupClick = (e) => {
    if (e.target.closest(".cancel")) {
      removePopup();
    } else if (e.target.closest(".eye")) {
      handlePasswordToggleEye(e.target.closest(".eye"));
    }
  };

  document.body.appendChild(popupContainer);
  popupContainer.appendChild(form);
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("click", handlePopupClick);
  popupContainer.timeoutId = setTimeout(removePopup, 60000);
};

export const handleAddEditTodo = (todo = null) => {
  let existingPopup = document.querySelector(".popup-container");
  if (existingPopup) {
    clearTimeout(existingPopup.timeoutId);
    existingPopup.querySelector(".cancel").remove();
    existingPopup.querySelector("form").remove();
    existingPopup.remove();
  }

  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const form = document.createElement("form");
  form.classList.add("box", "max-w-screen-sm");

  form.innerHTML = `
    <h2 class="main-heading md:pb-2 pb-1">${
      todo ? "Edit Todo" : "Add New Todo"
    }</h2>
    <textarea id="text" name="text" placeholder="Enter todo" class="textarea resize-none" rows="5" maxlength="300">${
      todo?.text || ""
    }</textarea>
    <input id="dueTime" name="dueTime" type="datetime-local" class="input uppercase" value="${
      todo?.dueTime || ""
    }" required />
    <div class="w-full flex gap-4">
      <button type="submit" class="w-1/2 btn-lg btn-orange">${
        todo ? "Update" : "Add"
      }</button>
      <button type="button" class="cancel w-1/2 btn-lg btn-gray">Cancel</button>
    </div>
  `;

  const cancelButton = form.querySelector(".cancel");
  const removePopup = () => {
    clearTimeout(popupContainer.timeoutId);
    form.removeEventListener("submit", handleFormSubmit);
    cancelButton.removeEventListener("click", removePopup);
    popupContainer.remove();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validatedData = validate(form, ["text", "dueTime"]);
    if (!validatedData) return;
    const { text, dueTime } = validatedData;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg viewBox="0 0 512 512" class="animate-spin size-4.5 fill-white">
      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM304 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
    </svg>`;

    try {
      if (
        todo &&
        todo.text === text &&
        new Date(todo.dueTime).getTime() === new Date(dueTime).getTime()
      ) {
        throw new Error("No changes detected");
      }

      const response = todo
        ? await TodoService.updateTodo(todo._id, text, dueTime)
        : await TodoService.addTodo(text, dueTime);

      addOrUpdateTodo(response.data);
      renderTodos(todos);
      renderMessagePopup(response.message);
      removePopup();
    } catch (error) {
      renderMessagePopup(error.response?.data?.message || error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = todo ? "Update" : "Add";
    }
  };

  document.body.appendChild(popupContainer);
  popupContainer.appendChild(form);
  form.addEventListener("submit", handleFormSubmit);
  cancelButton.addEventListener("click", removePopup);
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
    addOrUpdateTodo(response.data);
    status = response.data.status;
    renderTodos(todos);
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  } finally {
    targetBtn.disabled = false;
    targetBtn.innerHTML = status
      ? `<svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`
      : `<svg viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`;
  }
};

export const handleDeleteTodo = async (todoId) => {
  try {
    const response = await TodoService.deleteTodo(todoId);
    deleteTodo(todoId);
    renderTodos(todos);
    renderMessagePopup(response.message);
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  }
};

export const handleTodosInitialization = async () => {
  try {
    const response = await TodoService.fetchTodos();
    setTodos(response.data);
    renderTodos(todos);

    document.querySelector("#todos")?.addEventListener("click", async (e) => {
      const target = e.target.closest(".todo");
      if (!target) return;

      const todoId = target.id.split("-")[1];
      const todo = getTodo(todoId);

      if (e.target.closest(".status")) {
        await handleToggleTodoStatus(
          todoId,
          !todo.status,
          e.target.closest(".status")
        );
      } else if (e.target.closest(".edit")) {
        handleAddEditTodo(todo);
      } else if (e.target.closest(".delete")) {
        renderUserConfirmation("Do you want to delete this todo?", () =>
          handleDeleteTodo(todoId)
        );
      } else if (e.target.closest(".read-more")) {
        const description = target.querySelector("p");
        description.innerHTML = todo.description;
        e.target.textContent =
          e.target.textContent === "read more" ? "read less" : "read more";
      }
    });
  } catch (error) {
    renderMessagePopup(error.response?.data?.message || error.message);
  }
};

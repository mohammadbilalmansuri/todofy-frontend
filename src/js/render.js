import { getTimeLeft } from "./utils.js";

export const renderMessagePopup = (message) => {
  const popup = document.createElement("div");
  popup.className = "notification small-popup";

  popup.innerHTML = `
  <p class="text-gray-100">${message}</p>
  <button class="close min-w-fit relative flex items-center justify-center fill-orange ml-2">
    <svg viewBox="0 0 384 512" class="size-3 absolute"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>

    <svg viewBox="0 0 512 512" class="size-5 stroke-orange absolute">
      <rect x="64" y="64" width="384" height="384" rx="96" ry="96" fill="none" stroke-width="32" stroke-dasharray="1536" stroke-dashoffset="1536">
        <animate attributeName="stroke-dashoffset" from="1536" to="0" dur="4s" fill="freeze" />
      </rect>
    </svg>
  </button>
`;

  const removePopup = () => {
    popup.remove();
    clearTimeout(popup.timeoutId);
  };

  const existingPopup = document.querySelector(".small-popup");
  if (existingPopup) {
    existingPopup.removeEventListener("click", removePopup);
    clearTimeout(existingPopup.timeoutId);
    existingPopup.remove();
  }

  document.body.appendChild(popup);
  popup
    .querySelector(".close")
    .addEventListener("click", removePopup, { once: true });
  popup.timeoutId = setTimeout(removePopup, 4000);
};

export const renderUserConfirmation = (message, callback = () => {}) => {
  const popup = document.createElement("div");
  popup.className = "confirmation small-popup";

  popup.innerHTML = `
    <p class="secondary-heading">${message}</p>
    <div class="w-fit flex gap-2">
      <button class="cancel p-[9px]>
        <svg viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </button>
      <button class="confirm icon">
        <svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
      </button>
    </div>
  `;

  const removePopup = () => {
    clearTimeout(popup.timeoutId);
    popup.remove();
  };

  const handleEvent = (e) => {
    const target = e.target.closest(".confirm, .cancel");
    if (!target) return;

    if (target.classList.contains("confirm")) {
      target.innerHTML = `
        <svg viewBox="0 0 512 512" class="animate-spin"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
      `;
      target.disabled = true;

      callback();
      target.disabled = false;
      removePopup();
    } else {
      removePopup();
    }
  };

  const existingPopup = document.querySelector(".confirmation");
  if (existingPopup) {
    existingPopup.removeEventListener("click", handleEvent);
    clearTimeout(existingPopup.timeoutId);
    existingPopup.remove();
  }

  document.body.appendChild(popup);
  popup.addEventListener("click", handleEvent);
  popup.timeoutId = setTimeout(removePopup, 60000);
};

export const renderTodos = (todos) => {
  const todosContainer = document.querySelector("#todos");
  if (todos.length === 0) {
    const noTodosMessage = todosContainer.querySelector(".no-todos-message");
    noTodosMessage.textContent = "You have no tasks. Feel free to add some!";
    return;
  }

  todosContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.id = `todo-${todo._id}`;
    const parsedDueTime = getTimeLeft(todo.dueTime);
    todoDiv.className = `todo ${
      parsedDueTime.startsWith("Time's up")
        ? "border-orange"
        : "border-gray-500"
    }`;

    todoDiv.innerHTML = `
  <div class="flex flex-col items-start gap-1">
      <h3 class="secondary-heading${todo.status ? " line-through" : ""}">${
      todo.title
    }</h3>
    ${
      todo.description
        ? `<p${todo.status ? " class='line-through'" : ""}>${
            todo.description.length > 50
              ? `${todo.description.slice(
                  0,
                  50
                )}...<button class="read-more">Read More</button>`
              : todo.description
          }</p>`
        : ""
    }
  </div>
  <div class="min-w-fit flex items-center gap-2">
  ${
    !todo.status
      ? `<p class="due-time${
          parsedDueTime.startsWith("Time's up") ? " text-orange" : ""
        }">
          ${parsedDueTime}
      </p>`
      : ""
  }
  <button class="status icon ${todo.status ? "checked" : "unchecked"}">
    ${
      todo.status
        ? `<svg viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`
        : `<svg viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`
    }
  </button>
  <button class="edit icon">
    <svg viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
  </button>
  <button class="delete icon">
    <svg viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
  </button>
</div>
`;

    fragment.appendChild(todoDiv);
  });

  todosContainer.appendChild(fragment);
};

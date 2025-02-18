import { renderMessagePopup } from "./render.js";

const rules = new Map([
  [
    "email",
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: "Invalid email",
    },
  ],
  [
    "password",
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,24}$/,
      error:
        "Password must be 8-24 characters long, include uppercase, lowercase, number, and special character",
    },
  ],
  [
    "name",
    {
      validate: (name) => name.length >= 1 && name.length <= 30,
      error: "Name must be between 1 and 30 characters",
    },
  ],
  [
    "text",
    {
      validate: (text) => text.length >= 1 && text.length <= 300,
      error: "Text must be between 1 and 300 characters",
    },
  ],
  [
    "dueTime",
    {
      pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      error: "Due time must be in the format YYYY-MM-DDTHH:MM",
    },
  ],
]);

const validate = (form, fields) => {
  const values = {};

  for (const field of fields) {
    const input = form[field];
    const rule = rules.get(field);

    if (!rule) continue;

    const value = input.value.trim();

    const isValid = rule.pattern
      ? rule.pattern.test(value)
      : rule.validate(value);

    if (!isValid) {
      input.focus();
      renderMessagePopup(rule.error);
      return null;
    }

    values[field] = value;
  }
  return values;
};

export default validate;

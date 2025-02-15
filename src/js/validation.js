const Validation = {
  isEmailValid: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPasswordValid: (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,24}$/.test(password),
  isNameValid: (name) => /^.{3,50}$/.test(name),
  isTitleValid: (title) => /^.{1,100}$/.test(title),
  isDescriptionValid: (description) => /^.{0,200}$/.test(description),
  isDueTimeValid: (dueTime) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dueTime),
};

export default Validation;

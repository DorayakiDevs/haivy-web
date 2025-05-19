export const MIN_NAME_LENGTH = 4;
export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return "Email is required.";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Invalid email format.";
  }

  return "";
}

export function validateFullName(name: string): string {
  if (!name.trim()) {
    return "Full name is required.";
  }

  if (name.length < MIN_NAME_LENGTH) {
    return `Full name must be at least ${MIN_NAME_LENGTH} characters.`;
  }

  if (/[^a-zA-Z\s]/.test(name)) {
    return "Full name can only contain letters and spaces.";
  }

  return "";
}

export function validateBasicPassword(password: string): string {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return "";
}

export function validatePassword(password: string): string {
  const basicValidation = validateBasicPassword(password);

  if (basicValidation) {
    return basicValidation;
  }

  const PASSWORD_COMPLEXITY_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  if (!PASSWORD_COMPLEXITY_REGEX.test(password)) {
    return "Password must contain uppercase, lowercase, number, and special character.";
  }

  if (/\s/.test(password)) {
    return "Password cannot contain spaces.";
  }

  return "";
}

export const validateEmailAndPassword = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return {valid: false, message: 'Enter a valid email'};
  }

  if (!password || password.length < 6) {
    return {valid: false, message: 'Password must be at least 6 characters'};
  }

  return {valid: true};
};

const STORAGE_KEY = 'echo_v3';

export const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

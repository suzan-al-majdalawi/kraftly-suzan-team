import { ref } from "vue";

// Access token lagras endast i minnet.
// Den sparas aldrig i localStorage eller sessionStorage.
const accessToken = ref(null);

export const getAccessToken = () => accessToken.value;

export const setAccessToken = (token) => {
  accessToken.value = token || null;
};

export const clearAccessToken = () => {
  accessToken.value = null;
};

import axios, { AxiosError } from "axios";

export const checkStatus = async (url: string) => {
  try {
    const response = await axios.get(url);

    return {
      url: url,
      status: response.status,
      text: response.statusText,
    };
  } catch (error) {
    if ((error as AxiosError).response) {
      return {
        url: url,
        status: (error as AxiosError).response?.status || 500,
        text: (error as AxiosError).response.statusText,
      };
    } else if ((error as AxiosError).request) {
      return {
        url: url,
        status: undefined,
        text: "No response received.",
      };
    } else {
      return {
        url: url,
        status: undefined,
        text: `Error, ${(error as AxiosError).message}`,
      };
    }
  }
};

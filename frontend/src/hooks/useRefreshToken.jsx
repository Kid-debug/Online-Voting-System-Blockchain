import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("http://localhost:3000/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log("Access Token: ", JSON.stringify(prev));
      console.log("Refresh Token: ", response.data.accessToken);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

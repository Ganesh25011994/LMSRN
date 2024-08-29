import axios, { AxiosResponse } from "axios";
import * as AppType from "@/apptypes/AppTypes";

export let apiURL = AppType.APIURL.UATURL;

export let options = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Username: "60011",
  Password: "516edd40eedbe8194bc0e743fe75c59b",
};

export const postMethod = async (
  apiClassName: string,
  apiMethod: string,
  reqBody: Record<string, string | number | object | null>,
  method?: "get"
) => {
  try {
    let link = `${apiURL}/${apiClassName}/${apiMethod}`;
    console.log("EndPoint link", link);
    if (method == "get") {
      const { data } = await axios.get(link, { headers: options });
      console.log(data, "response");
      return data;
    } else {
      const { data } = await axios.post(link, reqBody, { headers: options });
      console.log(data, "response");
      return data;
    }
  } catch (error) {
    return error;
  }
};

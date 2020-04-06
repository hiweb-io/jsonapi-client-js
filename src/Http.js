import axios from "axios";
import { JsonApi } from './JsonApi'

const requestHandler = (request) => {
  request.headers['Content-Type'] = 'application/vnd.api+json'
};

const successHandler = response => {
  return new JsonApi(response);
};

const errorHandler = (error) => {
  console.log(error);
  return Promise.reject(error);
};

export class Http {
  /**
   * @param string
   */
  constructor(apiBaseUrl) {
    this.axios = axios.create({
      baseURL: apiBaseUrl,
      responseType: "json",
    });

    //Enable request interceptor
    this.axios.interceptors.request.use(
      (request) => requestHandler(request),
      (error) => errorHandler(error)
    );

    //Response and Error handler
    this.axios.interceptors.response.use(
      (response) => successHandler(response),
      (error) => errorHandler(error)
    );
  }

  /**
   * Get Http Request
   * @param string endpoint
   * @param object query params
   * @param object options
   */
  get(action, params, options) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: "GET",
          params,
          ...options,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
}

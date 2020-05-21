import axios from "axios";
import JsonApi from './JsonApi'

class Http {

  /**
  * The constructor
  *
  * @param string Base API endpoint
  */
  constructor(baseUrl) {

    // Url
    this.url = baseUrl;

    // Headers
    this.headers = {};

    // Default request options
    this.options = {
      responseType: 'json',
      baseURL: this.url
    };
  }

  /**
  * Set headers
  *
  * @param object
  * @return this
  */
  setHeaders(headers) {

    if (typeof headers === 'object') {
      this.headers = headers;
    }

    return this;
  }

  /**
  * Make request options
  *
  * @param object
  * @return object
  */
  makeRequestOptions(options) {

    // Request options
    let requestOptions = JSON.parse(JSON.stringify(this.options));
    requestOptions.headers = this.headers;

    if (typeof options === 'object') {

      for (let optionKey in options) {

        // Merge header
        if (typeof optionKey === 'headers') {

          for (let headerName in options.headers) {
            requestOptions.headers[headerName] = options.headers[headerName];
          }
          continue;
        }

        // Set option
        requestOptions[optionKey] = options[optionKey];

      }

    }

    return requestOptions;
  }

  /**
  * Send custom request
  *
  * @param object Options
  * @return Promise
  */
  request(path, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);
      requestOptions.url = requestOptions.baseURL + path;

      // Send request with axios
      axios(requestOptions).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });

  }

  /**
  * Find a single resource
  *
  * @param string Resource type
  * @param string Resource id
  * @param object Options
  * @return Promise
  */
  find(resourceType, resourceId, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);

      // Send request with axios
      axios.get(resourceType + '/' + resourceId, requestOptions).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });

  }

  /**
  * Get a collection of resources
  *
  * @param string
  * @param object Options
  * @return Promise
  */
  collection(resourceType, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);

      // Send request with axios
      axios.get(resourceType, requestOptions).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });
  }

  /**
  * Create a resource
  *
  * @param JsonApi JsonApi document object
  * @param object Options
  * @return Promise
  */
  create(jsonapiDocument, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);

      // Request instance
      let instance = axios.create(requestOptions);

      // Send request with axios
      instance.post(jsonapiDocument.getData().getType(), jsonapiDocument.compile()).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });

  }

  /**
  * Update a resource
  *
  * @param JsonApi JsonApi document object
  * @param object Options
  * @return Promise
  */
  update(jsonapiDocument, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);

      // Request instance
      let instance = axios.create(requestOptions);

      // Resource object
      let resource = jsonapiDocument.getData();

      // Send request with axios
      instance.patch(resource.getType() + '/' + resource.getId(), jsonapiDocument.compile()).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });

  }

  /**
  * Save a resource - shortcut to create() and update()
  *
  * @param JsonApi JsonApi document object
  * @param object Options
  * @return Promise
  */
  save(jsonapiDocument, options) {

    // Update if has id
    if (jsonapiDocument.getData().getId()) {
      return this.update(jsonapiDocument, options);
    }

    // Create if no id
    return this.create(jsonapiDocument, options);
  }

  /**
  * Detele a resource
  *
  * @param string Resource type
  * @param string Resource ID
  * @param object Request options
  * @return Promise
  */
  delete(resourceType, resourceId, options) {

    // Return a promise
    return new Promise((resolve, reject) => {

      // Request options
      let requestOptions = this.makeRequestOptions(options);

      // Send request with axios
      axios.delete(resourceType + '/' + resourceId, requestOptions).then(response => {

        // Return a document
        return resolve(new JsonApi(response.data));

      }).catch(e => {
        return reject(e);
      });

    });

  }

}

export default Http;
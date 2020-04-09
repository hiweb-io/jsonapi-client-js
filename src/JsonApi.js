import { Resource } from "./Resource";
import query from "./helpers/query";

export class JsonApi {
  /**
   * @param string
   */
  constructor(jsonapi) {
    // Parse from string
    let data = JSON.parse(jsonapi);

    // Document object
    this.jsonapi = {};

    // Resource container
    this.resourceContainer = [];

    // Map resources to resource objects
    if (Array.isArray(data.data)) {
      // Data is array

      this.jsonapi.data = [];

      data.data.forEach(resourceData => {
        // Create new resource object
        let resource = this.makeResource(resourceData);

        // Map to data
        this.jsonapi.data.push(resource);

        // Push to resource container
        this.resourceContainer.push(resource);
      });
    } else {
      // Data is object
      let resource = this.makeResource(data.data);
      this.jsonapi.data = resource;
      this.resourceContainer.push(resource);
    }
  }

  /**
   * Get primary data
   */
  getData() {
    return this.jsonapi.data;
  }

  /**
   * Set primary data
   * @param object primary data
   */
  setData(data) {
    this.jsonapi.data = data;
  }

  /**
   * Get included data
   */
  getIncluded() {
    return this.jsonapi.included;
  }

  /**
   * Make a new resource
   *
   * @param object (Optional)
   * @return Resource
   */
  makeResource(data) {
    return new Resource(data, this.jsonapi);
  }

  /**
   * Find a specific resource
   *
   * @param string
   * @param string
   * @return Resource|null
   */
  findResource(type, id) {
    // Find in resource container
    return (
      this.resourceContainer.find(resource => {
        return resource.type === type && resource.id === id;
      }) || null
    );
  }

  /**
   * Find resources
   * Supported operator: =, >, <, >=, <=
   *
   * @param array Valid format: ['field', 'value'], ['field', 'operator', 'value']. IE: ['name', 'John'] or ['price', '>=', 9.99]
   * @return array
   */
  findResources(queryData) {
    // No query data - return all resources
    if (!queryData) {
      return this.resourceContainer;
    }

    // If query data is not array
    if (queryData && !Array.isArray(queryData)) {
      console.log("Query data must be an array");
      return [];
    }

    // Find in resource container
    return this.resourceContainer.filter(resource => {
      // If query data is a single query
      if (typeof queryData[0] === "string") {
        return query.checkResource(queryData, resource);
      }

      // Is multi-queries. Check all
      return queryData.find(query => {
        return !query.checkResource(query, resource);
      })
        ? false
        : true;
    });
  }
}

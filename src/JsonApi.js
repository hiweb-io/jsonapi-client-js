import Resource from "./Resource";
import query from "./helpers/query";

export default class JsonApi {
  /**
   * @param string
   */
  constructor(jsonapi) {

    // Document object
    this.jsonapi = {};

    // Resource container
    this.resourceContainer = [];

    let data = null;

    // No input
    if (!jsonapi) {
      return;
    } else if (typeof jsonapi === 'string') {
      // Parse from string
      data = JSON.parse(jsonapi);
    } else {
      data = jsonapi;
    }    

    // Map primary resources to resource objects
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

    // Map included resources
    if (data.hasOwnProperty('included') && Array.isArray(data.included) && data.included.length) {

      this.jsonapi.included = [];

      // Mapping
      data.included.forEach(resourceData => {

        // Create resource object
        let resource = this.makeResource(resourceData);

        // Map to included
        this.jsonapi.included.push(resource);

        // Push to resource container
        this.resourceContainer.push(resource);

      });

    }

    // If errors
    if (typeof data.errors !== 'undefined') {
      this.jsonapi.errors = data.errors;
    }

    // If meta
    if (typeof data.meta === 'object') {
      this.jsonapi.meta = data.meta;
    }

    // If links
    if (typeof data.links === 'object') {
      this.jsonapi.links = data.links;
    }

    // Cache
    this.cache = {};
  }

  /**
  * Compile
  *
  * @return object
  */
  compile() {

    let data = {};

    // Data
    if (Array.isArray(this.jsonapi.data)) {

      // Document data is array
      data.data = [];

      // Compile resources
      this.jsonapi.data.forEach(resource => {
        data.data.push(resource.compile());
      });

    } else {
      data.data = this.jsonapi.data.compile();
    }

    // Included
    if (Array.isArray(this.jsonapi.included)) {

      // Compile included data
      data.included = [];

      this.jsonapi.included.forEach(resource => {
        data.included.push(resource.compile());
      });

    }

    // Errors
    if (this.getErrors()) {
      data.errors = this.getErrors();
    }

    // Meta
    if (this.getMeta()) {
      data.meta = this.getMeta();
    }

    // Links
    if (this.getLinks()) {
      data.links = this.getLinks();
    }

    return data;

  }

  /**
  * To JSON
  *
  * @return string
  */
  toJson() {
    return JSON.stringify(this.compile());
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

    if (data instanceof Resource) {
      
      this.jsonapi.data = data;
      this.pushToResourceContainer(data);

    } else if (Array.isArray(data)) {

      this.jsonapi.data = data.filter(resource => {
        
        if (resource instanceof Resource) {
          this.pushToResourceContainer(resource);
          return true;
        }

        return false;

      });

    }

  }

  /**
  * Set included data
  *
  * @param array
  */
  setIncluded(data) {

    if (data instanceof Resource) {
      
      this.jsonapi.included = [data];
      this.pushToResourceContainer(data);

    } else if (Array.isArray(data)) {

      this.jsonapi.included = data.filter(resource => {
        
        if (resource instanceof Resource) {
          this.pushToResourceContainer(resource);
          return true;
        }

        return false;

      });

    }

  }

  /**
  * Push resource to resource container
  *
  * @param Resource
  */
  pushToResourceContainer(resource) {

    if (!this.resourceContainer.find(resource => {
      return resource.getId() === resource.getId()
    })) {
      this.resourceContainer.push(resource);
    }

  }

  /**
   * Get included data
   */
  getIncluded() {
    return this.jsonapi.included;
  }

  /**
  * Get errors
  */
  getErrors() {
    return this.jsonapi.errors;
  }

  /**
  * Get meta
  */
  getMeta() {
    return this.jsonapi.meta;
  }

  /**
  * Get links
  */
  getLinks() {
    return this.jsonapi.links;
  }

  /**
   * Make a new resource
   *
   * @param object (Optional)
   * @return Resource
   */
  makeResource(data) {
    return new Resource(data, this);
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
        return resource.getType() === type && resource.getId() === id;
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

    // Cache found
    if (typeof this.cache[JSON.stringify(queryData)] !== 'undefined') {
      return this.cache[JSON.stringify(queryData)];
    }

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
    let resources = this.resourceContainer.filter(resource => {
      // If query data is a single query
      if (typeof queryData[0] === "string") {
        return query.checkResource(queryData, resource);
      }

      // Is multi-queries. Check all
      return queryData.find(_queryData => {
        return !query.checkResource(_queryData, resource);
      })
        ? false
        : true;
    });

    // Save to cache
    this.cache[JSON.stringify(queryData)] = resources;

    return resources;
  }
}

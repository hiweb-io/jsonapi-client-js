import Relationships from './elements/Relationships';

export default class Resource {

  constructor(resource, jsonapi) {

    this.isResource = true;

    this.data = {};

    // If resource input is an Resource instance
    if (resource && resource.isResource) {
      resource = resource.compile();
    }

    // check data is valid
    if (typeof resource === 'object' && typeof resource.id === 'string' && typeof resource.type === 'string') {
      
      for (let key in resource) {

        // Only accept data from valid attributes
        if (['id', 'type', 'attributes', 'relationships', 'meta', 'links'].indexOf(key) > -1) {
          this.data[key] = resource[key];
        }

      }

      // Map relationships object
      if (typeof this.data.relationships !== 'undefined') {
        this.data.relationships = new Relationships(this.data.relationships, this);
      }

    }

    // Parent document object
    this.jsonapi = jsonapi;

  }

  /**
  * Get document
  * 
  * @return JsonApi
  */
  getDocument() {
    return this.jsonapi;
  }

  /**
   * Get resource id
   *
   * @return string
   */
  getId() {
    return this.data.id;
  }

  /**
   * Set resource id
   * @param string resource id
   * @return void
   */
  setId(id) {
    this.data.id = id;
  }

  /**
   * Get resource type
   *
   * @return string
   */
  getType() {
    return this.data.type;
  }

  /**
   * Set resource type
   * @param string resource id
   * @return void
   */
  setType(type) {
    this.data.type = type;
  }

  /**
   * Get resource attribute value
   *
   * @param string Attribute name
   * @param mixed Default value - in case attribute not found
   * @return mixed|null
   */
  getAttribute(attributeName, defaultValue) {
    if (this.data.attributes.hasOwnProperty(attributeName)) {
      return this.data.attributes[attributeName];
    }

    return defaultValue || null;
  }

  /**
   * Set resource attribute value
   *
   * @param string Attribute name
   * @param object Attribute value
   * @return void
   */
  setAttribute(attributeName, attributeValue) {

    if (typeof this.data.attributes !== 'object') {
      this.data.attributes = {};
    }

    this.data.attributes[attributeName] = attributeValue;
  }

  /**
   * Get attributes
   *
   * @return array
   */
  getAttributes() {
    return this.data.attributes;
  }

  /**
   * Set resource attributes value
   *
   * @param object Attributes value
   * @return void
   */
  setAttributes(attributes) {
    this.data.attributes = attributes;
  }

  /**
  * Get meta
  *
  * @return object|null
  */
  getMeta() {
    return this.data.meta || null;
  }

  /**
  * Get links
  *
  * @return object|null
  */
  getLinks() {
    return this.data.links || null;
  }

  /**
  * Compile
  *
  * @return object
  */
  compile() {

    let resource = {
      type: this.getType()
    };
    
    if (this.getId()) {
      resource.id = this.getId();
    }

    if (this.getAttributes()) {
      resource.attributes = this.getAttributes();
    }

    if (this.getRelationships()) {
      resource.relationships = this.getRelationships();
    }

    if (this.getMeta()) {
      resource.meta = this.getMeta();
    }

    return resource;
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
   * Get relationship data
   *
   * @param string Relationship key
   * @return Resource|array
   */
  getRelationshipData(relationshipKey) {

    if (this.data.relationships instanceof Relationships) {
      return this.data.relationships.getRelationshipData(relationshipKey);
    }
  
    return null;    
  }

  /**
  * Get relationships
  *
  * @param void
  * @return object Relationships object
  */
  getRelationships() {

    if (this.data.relationships instanceof Relationships) {
      return this.data.relationships.compile();
    }
    
    return null;
  }

  /**
  * Get relationship
  *
  * @param string
  * @return object|null Relationship object
  */
  getRelationship(key) {

    if (this.data.relationships instanceof Relationships) {
      return this.data.relationships.getRelationship(key);
    }
    
    return null;

  }

  /**
   * Set relationship data
   *
   * @param string Relationship key
   * @param Object Relationship value
   * @return void
   */
  setRelationship(key, value) {

    if (typeof this.data.relationships === 'undefined' || !this.data.relationships instanceof Relationships) {
      this.data.relationships = new Relationships({}, this);
    }

    this.data.relationships.setRelationship(key, value);

  }
}
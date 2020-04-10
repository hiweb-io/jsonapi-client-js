export class Resource {

  constructor(data, jsonapi) {
    this.data = {};

    // check data is valid
    if (data) {
      this.data = data;
    }

    this.jsonapi = jsonapi;
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
   * Get relationship data
   *
   * @param string Relationship key
   * @return Resource|array
   */
  getRelationshipData(relationshipKey) {

    // Return null in case of no relationship found
    if (!this.data.relationships.hasOwnProperty(relationshipKey)) {
      return null;
    }

    // Relationship
    const relationshipData = this.data.relationships[relationshipKey].data;

    // If relationship is to-many
    if (Array.isArray(relationshipData)) {
      // Get ids and type
      let type = null;
      let ids = relationshipData.map(relationship => {
        // Set type
        if (!type) {
          type = relationship.type;
        }

        return relationship.id;
      });

      // Make a query
      return this.jsonapi.findResources([
        // First query is type
        ["type", type],

        // Second query is finding by ids
        ["id", "IN", ids]
      ]);

    }

    // Find resource
    return this.jsonapi.findResource(
      relationshipData.type,
      relationshipData.id
    );
  }

  /**
  * Get relationships
  *
  * @param void
  * @return object Relationships object
  */
  getRelationships() {
    return this.data.relationships;
  }

  /**
  * Get relationship
  *
  * @param string
  * @return object|null Relationship object
  */
  getRelationship(key) {

    if (typeof this.data.relationships === 'object' && typeof this.data.relationships[key] !== 'undefined') {
      return this.data.relationships[key];
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

    // check key or value is null
    if(!key || !value) {
      return;
    }

    // Relationship data array handler
    const makeRelationshipArrayData = relationshipData => {

      this.data.relationships[key].data = [];

      relationshipData.forEach(resource => {

        // If resource is an instance of Resource class
        if (resource instanceof Resource) {
          
          // Push resource linkage object to relationship data
          this.data.relationships[key].data.push({
            id: resource.getId(),
            type: resource.getType()
          });
          return;

        }

        // If resource is a valid resource-linkage
        if (typeof resource === 'object' && typeof resource.id === 'string' && typeof resource.type === 'string') {

          // Push resource linkage object to relationship data
          this.data.relationships[key].data.push({
            id: resource.id,
            type: resource.type
          });
          return;

        }

      });

    };

    // Value is array
    if (Array.isArray(value)) {
      makeRelationshipArrayData(value);
      return;
    }

    // Value is a object
    if (typeof value === 'object') {
      
      // If value is a Resource
      if (value instanceof Resource) {
        
        // Set resource linkage object to relationship data
        this.data.relationships[key].data = {
          id: value.getId(),
          type: value.getType()
        };
        return;

      }

      // Value is a resource-linkage
      if (typeof value.id === 'string' && typeof value.type === 'string') {

        // Set resource linkage object to relationship data
        this.data.relationships[key].data = {
          id: value.id,
          type: value.type
        };
        return;

      }

      // Value isn't a resource nor resource-linkage
      // Check if value is a valid relationship object
      let validKeys = ['data', 'links', 'meta'];
      for (let relationshipObjectKey in value) {

        // Key isn't valid
        if (validKeys.indexOf(relationshipObjectKey) === -1) {
          console.log('Member ' + relationshipObjectKey + ' is not allowed');
          return;
        }
      }

      // Skip if relationship data is not set
      if (typeof value.data === 'undefined') {
        console.log('Cannot set relationship. Missing relationship data.')
        return;
      }

      // If relationship data is an array
      if (Array.isArray(value.data)) {

        makeRelationshipArrayData(value.data);

      // If relationship data is a resource
      } else if (value.data instanceof Resource) {
        
        // Set resource linkage object to relationship data
        this.data.relationships[key].data = {
          id: value.data.getId(),
          type: value.data.getType()
        };

      // If relationship data is an object - Then it must be a valid resource linkage object
      } else if (typeof value.data.id === 'string' && typeof value.data.type === 'string') {

        // Set resource linkage object to relationship data
        this.data.relationships[key].data = {
          id: value.data.id,
          type: value.data.type
        };

      // Unknown data format
      } else {

        // Return
        console.log('Failed to set relationship data. Invalid relationship data format.');
        return;

      }

      // Set relationship links if present
      if (typeof value.links !== 'undefined') {

        // ... need validation here
        this.data.relationships[key].links = value.links;
      }

      // Set relationship meta if present
      if (typeof value.meta !== 'undefined') {

        // ... need validation here
        this.data.relationships[key].meta = value.meta;
      }

    }
  }
}

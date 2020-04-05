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
   * @return
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
   * @return
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
   * @return
   */
  setAttribute(attributeName, attributeValue) {
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
   * @return
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
   * Set relationship data
   *
   * @param string Relationship key
   * @param Object Relationship value
   * @return
   */
  setRelationshipData(key, value) {
    this.data.relationships[key] = value;
  }
}

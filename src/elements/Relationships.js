import Relationship from './Relationship';

class Relationships {

  /**
  * Relationships object
  *
  * @param object Relationship data
  * @param Resource
  */
  constructor(relationships, resource) {

    // Resource object
    this.resource = resource;

    // Relationships data
    this.data = {
    };

    // Map relationship objects
    for (let relationshipName in relationships) {

      if (typeof relationshipName !== 'string') {
        console.log('Failed to set relationship, relationship name must be a string');
        continue;
      }

      this.data[relationshipName] = new Relationship(relationships[relationshipName], this.resource);

    }

    // Compiled data
    this.compiledData = null;

  }

  /**
  * Get data
  */
  compile(reload) {
    
    if (!reload && this.compiledData) {
      return this.compiledData;
    }

    this.compiledData = {};

    for (let relationshipName in this.data) {
      this.compiledData[relationshipName] = this.data[relationshipName].compile();
    }

    return this.compiledData;
  }

  /**
  * Export to json
  *
  * @return string
  */
  toJson() {

    let json = {};

    for (let relationshipName in this.data) {
      json[relationshipName] = this.data[relationshipName].compile();
    }

    return JSON.stringify(json);
  }

  /**
  * Set relationship
  *
  * @param string
  * @param object Relationship data
  * @return this
  */
  setRelationship(relationshipName, relationshipData) {

    if (typeof relationshipName !== 'string') {
      return;
    }

    this.data[relationshipName] = new Relationship(relationshipData, this.resource);

    // Recompile data
    this.compile(true);

    return this;
  }

  /**
  * Get relationship
  *
  * @param string Relationship name
  */
  getRelationship(relationshipName) {

    if (!this.data[relationshipName] instanceof Relationship) {
      return null;
    }

    return this.data[relationshipName].compile();

  }

  /**
  * Get relationship resource data
  *
  * @param string Relationship name
  */
  getRelationshipData(relationshipName) {

    // Return null in case of no relationship found
    if (!this.data.hasOwnProperty(relationshipName)) {
      return null;
    }

    return this.data[relationshipName].getRelationshipData(relationshipName);

  }

}

export default Relationships;
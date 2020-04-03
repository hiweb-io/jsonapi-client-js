export class Resource {
  constructor(data, included) {
    this.data = data;
    this.included = included;
  }

  getId() {
    return this.data.id;
  }

  getType() {
    return this.data.type;
  }

  getAttribute(attributeName) {
    if (this.data.attributes.hasOwnProperty(attributeName)) {
      return this.data.attributes[attributeName];
    }
    return new Error(`${attributeName} not found!`);
  }

  getAttributes() {
    return this.data.attributes;
  }

  getRelationshipData(relationshipKey) {
    if (!this.data.relationships.hasOwnProperty(relationshipKey)) {
      return new Error(`${relationshipKey} not found!`);
    }

    const relationshipData = this.data.relationships[relationshipKey].data;

    if (Array.isArray(relationshipData)) {
      return this.included.filter(el => {
        return relationshipData.some(
          tmp => el.type === tmp.type && el.id === tmp.id
        );
      });
    }

    return this.included.find(
      el => el.type === relationshipData.type && el.id === relationshipData.id
    );
  }
}
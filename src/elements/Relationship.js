class Relationship {

  constructor(relationship, resource) {

    // Resource object
    this.resource = resource;

    // Relationship object
    this.data = {
      data: null
    };

    // Relationship data array handler
    const makeRelationshipArrayData = relationshipData => {

      this.data.data = [];

      relationshipData.forEach(resource => {

        // If resource is an instance of Resource class
        if (resource.isResource) {
          
          // Push resource linkage object to relationship data
          this.data.data.push({
            id: resource.getId(),
            type: resource.getType()
          });
          return;

        }

        // If resource is a valid resource-linkage
        if (typeof resource === 'object' && typeof resource.id === 'string' && typeof resource.type === 'string') {

          // Push resource linkage object to relationship data
          this.data.data.push({
            id: resource.id,
            type: resource.type
          });
          return;

        }

      });

    };

    // Relationship data is array
    if (Array.isArray(relationship)) {
      makeRelationshipArrayData(relationship);
      return;
    }

    // Relationship is a object
    if (typeof relationship === 'object') {
      
      // If relationship is a Resource
      if (relationship.isResource) {
        
        // Set resource linkage object to relationship data
        this.data.data = {
          id: relationship.getId(),
          type: relationship.getType()
        };
        return;

      }

      // Relationship is a resource-linkage
      if (typeof relationship.id === 'string' && typeof relationship.type === 'string') {

        // Set resource linkage object to relationship data
        this.data.data = {
          id: relationship.id,
          type: relationship.type
        };
        return;

      }

      // Value isn't a resource nor resource-linkage
      // Check if value is a valid relationship object
      let validKeys = ['data', 'links', 'meta'];
      for (let relationshipObjectKey in relationship) {

        // Key isn't valid
        if (validKeys.indexOf(relationshipObjectKey) === -1) {
          console.log('Member ' + relationshipObjectKey + ' is not allowed');
          return;
        }
      }

      // Skip if relationship data is not set
      if (typeof relationship.data === 'undefined') {
        console.log('Cannot set relationship. Missing relationship data.')
        return;
      }

      // If relationship data is null
      if (!relationship.data) {

        this.data.data = null;

      // If relationship data is an array
      } else if (Array.isArray(relationship.data)) {

        makeRelationshipArrayData(relationship.data);

      // If relationship data is a resource
      } else if (relationship.data.isResource) {
        
        // Set resource linkage object to relationship data
        this.data.data = {
          id: relationship.data.getId(),
          type: relationship.data.getType()
        };

      // If relationship data is an object - Then it must be a valid resource linkage object
      } else if (typeof relationship.data.id === 'string' && typeof relationship.data.type === 'string') {

        // Set resource linkage object to relationship data
        this.data.data = {
          id: relationship.data.id,
          type: relationship.data.type
        };

      // Unknown data format
      } else {

        // Return
        console.log('Failed to set relationship data. Invalid relationship data format.');
        return;

      }

      // Set relationship links if present
      if (typeof relationship.links !== 'undefined') {

        // ... need validation here
        this.data.links = relationship.links;
      }

      // Set relationship meta if present
      if (typeof relationship.meta !== 'undefined') {

        // ... need validation here
        this.data.meta = relationship.meta;
      }

    }
    // End constructor

  }

  compile() {
    return this.data;
  }

  getRelationshipData() {

    if (!this.data.data) {
      return null;
    }

    // If relationship is to-many
    if (Array.isArray(this.data.data)) {

      // Get ids and type
      let type = null;
      let ids = this.data.data.map(relationship => {
        // Set type
        if (!type) {
          type = relationship.type;
        }

        return relationship.id;
      });

      // Make a query
      return this.resource.getDocument().findResources([
        // First query is type
        ["type", type],

        // Second query is finding by ids
        ["id", "IN", ids]
      ]);

    }

    // Find resource
    return this.resource.getDocument().findResource(
      this.data.data.type,
      this.data.data.id
    );

  }

}

export default Relationship;
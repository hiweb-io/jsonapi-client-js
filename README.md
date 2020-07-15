# json-api-client

# Installation

`npm i jsonapi-client-js`

# Simple usage

Example of building jsonapi data

```javascript
import { JsonApi } from 'jsonapi-client-js';

// Build a new document
let newDocument = new JsonApi;

// Build primary resource
let primaryResource = newDocument.makeResource();
primaryResource.setType('products');
primaryResource.setId('example product id');
primaryResource.setAttributes({
  title: 'Example product',
  price: 9.99  
});

// Build a relationship resource
let imageResource = newDocument.makeResource();
imageResource.setType('images');
imageResource.setId('example image id');
imageResource.setAttributes({
  path: 'example-image.jpg',
  alt: 'Example image'
});

// Set relationship
primaryResource.setRelationship('image', imageResource);

// Add resources to document
newDocument.setData(primaryResource);
newDocument.setIncluded(imageResource);

// Get the result
console.log(newDocument.toJson());

```

Example of reading jsonapi data

```javascript
import { JsonApi } from 'jsonapi-client-js';

// Parse jsonapi string
let doc = new JsonApi(jsonString);

// Get document data
// getData() method returns a single resource object or an array
let resource = doc.getData();

// Get resource type
console.log(resource.getType());

// Get resource id
console.log(resource.getId());

// Get resource attribute value
console.log(resource.getAttribute('name'));

// Get all attributes
console.log(resource.getAttributes()); // { key: value, key: value, ... }

// Get resource meta
console.log(resource.getMeta()); // { key: value, key: value, ... }

// Get relationships
console.log(resource.getRelationships());

// Get relationship data
// This method returns a single resource object or an array
console.log(resource.getRelationshipData('...relationship name...')); 
```

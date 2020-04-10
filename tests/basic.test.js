import { JsonApi } from '../src/JsonApi';

const exampleJsonApiData = JSON.stringify({
  data: {
    type: 'products',
    id: '1',
    attributes: {
      title: 'Example product title',
      description: 'Example description'
    },
    relationships: {
      variants: {
        data: [
          {
            type: 'variants',
            id: '1'
          },
          {
            type: 'variants',
            id: '2'
          }
        ]
      },
      image: {
        data: {
          type: 'images',
          id: '1'
        }
      }
    }
  },
  included: [
    {
      type: 'images',
      id: '1',
      attributes: {
        alt: 'Example image',
        src: 'http://example.com/image.jpg'
      }
    },
    {
      type: 'variants',
      id: '1',
      attributes: {
        price: 99.99,
      }
    },
    {
      type: 'variants',
      id: '1',
      attributes: {
        price: 9.99
      }
    }
  ]
});

// Test parse and find relationship resource
test('Test parse and find relationship data', () => {

  // Create json api document
  let jsonapi = new JsonApi(exampleJsonApiData);

  // Get primary resource
  let product = jsonapi.getData();
  expect(product.getType()).toBe('products');
  expect(product.getId()).toBe('1');
  expect(product.getAttribute('title')).toBe('Example product title');
  
  // Get product relationship resource
  let image = product.getRelationshipData('image');
  expect(image.getId()).toBe('1');
  expect(image.getType()).toBe('images');
  expect(image.getAttribute('src')).toBe('http://example.com/image.jpg');

});

// Test query
test('Test jsonapi query', () => {

  // Create json api document
  let jsonapi = new JsonApi(exampleJsonApiData);

  // Test find variant with price > 90
  let variant = jsonapi.findResources([
    ['type', 'variants'],
    ['price', '>', 90]
  ])[0];
  expect(variant.getType()).toBe('variants');
  expect(variant.getAttribute('price')).toBe(99.99);

});

// Test set relationship
test('Test setRelationship()', () => {

	// Create json api document
  let jsonapi = new JsonApi(exampleJsonApiData);

  // Get primary resource
  let product = jsonapi.getData();
 	
 	// Create new resources
 	let image = jsonapi.makeResource();
 	image.setType('images');
 	image.setId('new-image');
 	image.setAttribute('alt', 'Example image');

 	let variant1 = jsonapi.makeResource();
  variant1.setType('variants');
  variant1.setId('variant-1');
  variant1.setAttribute('price', 9.99);

  let variant2 = jsonapi.makeResource();
  variant2.setType('variants');
  variant2.setId('variant-2');
  variant2.setAttribute('price', 19.99);

 	// [CASE 1] //
 	// Test set relationship from a new resource
  product.setRelationship('image', image);
  expect(JSON.stringify(product.getRelationship('image'))).toBe(JSON.stringify({
  	data: {
  		id: image.getId(),
  		type: image.getType()
  	}
  }));

 	// [CASE 2] //
  // Test set relationship from a resource linkage object
  product.setRelationship('image', {
  	type: 'images',
  	id: 'test-set-relationship-from-resource-linkage'
  });
  expect(JSON.stringify(product.getRelationship('image'))).toBe(JSON.stringify({
  	data: {
  		id: 'test-set-relationship-from-resource-linkage',
  		type: 'images'
  	}
  }));

 	// [CASE 3] //
  // Test set relationship from an array of resources
  product.setRelationship('variants', [
  	variant1, variant2
  ]);
  expect(JSON.stringify(product.getRelationship('variants'))).toBe(JSON.stringify({
  	data: [
  		{
  			id: variant1.getId(),
  			type: variant1.getType()
  		},
  		{
  			id: variant2.getId(),
  			type: variant2.getType()
  		}
  	]
  }));

 	// [CASE 4] //
  // Test set relationship from a raw relationship object with data is a resource
  product.setRelationship('image', {
  	data: image,
  	meta: {
  		test: 'test-value'
  	}
  });
  expect(JSON.stringify(product.getRelationship('image'))).toBe(JSON.stringify({
  	data: {
  		id: image.getId(),
  		type: image.getType()
  	},
  	meta: {
  		test: 'test-value'
  	}
  }));

 	// [CASE 5] //
  // Test set relationship from a raw relationship object with data is a resource-linkage
  product.setRelationship('image', {
  	data: {
  		type: 'images',
  		id: 'test-image-id'
  	},
  	meta: {
  		test: 'test-blah'
  	}
  });
  expect(JSON.stringify(product.getRelationship('image'))).toBe(JSON.stringify({
  	data: {
  		id: 'test-image-id',
  		type: 'images'
  	},
  	meta: {
  		test: 'test-blah'
  	}
  }));

 	// [CASE 6] //
  // Test set relationship from a raw relationship object with data is an array of resources
  product.setRelationship('variants', {
  	data: [variant1, variant2],
  	meta: {
  		test: 'variants'
  	}
  });
  expect(JSON.stringify(product.getRelationship('variants'))).toBe(JSON.stringify({
  	data: [
  		{
  			id: variant1.getId(),
  			type: variant1.getType()
  		},
  		{
  			id: variant2.getId(),
  			type: variant2.getType()
  		}
  	],
  	meta: {
  		test: 'variants'
  	}
  }));

  // [CASE 7] //
  // Test set relationship from a raw relationship object with data is an array of resource-linkage objects
  product.setRelationship('variants', {
  	data: [
  		{
  			id: variant1.getId(),
  			type: variant1.getType()
  		},
  		{
  			id: variant2.getId(),
  			type: variant2.getType()
  		}
  	],
  	meta: {
  		test: 'test variants'
  	}
  });
  expect(JSON.stringify(product.getRelationship('variants'))).toBe(JSON.stringify({
  	data: [
  		{
  			id: variant1.getId(),
  			type: variant1.getType()
  		},
  		{
  			id: variant2.getId(),
  			type: variant2.getType()
  		}
  	],
  	meta: {
  		test: 'test variants'
  	}
  }));

});
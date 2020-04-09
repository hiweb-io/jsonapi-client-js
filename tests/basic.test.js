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
			type: 'images1',
			id: '2',
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

  // Set Relationship by one relationships object 
  const imageRequest = 
  {
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
        type: 'images1',
        id: '2'
      }
    }
  }
 
  product.setRelationship('image', imageRequest);
  
	// Get product relationship resource
  let image = product.getRelationshipData('image');
  expect(image.getId()).toBe('2');
  expect(image.getType()).toBe('images1');
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
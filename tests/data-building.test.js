import JsonApi from '../src/JsonApi';

// Test build a document
test('Test building product document', () => {

  let jDocument = new JsonApi();
  let product = jDocument.makeResource();
  product.setType('products');
  product.setAttributes({
    title: 'Example product',
    price: 9.99
  });
  product.setRelationship('image', {
    type: 'images',
    id: 'image-1'
  });

  jDocument.setData(product);

  expect(jDocument.toJson()).toBe('{"data":{"type":"products","attributes":{"title":"Example product","price":9.99},"relationships":{"image":{"data":{"id":"image-1","type":"images"}}}}}');

});
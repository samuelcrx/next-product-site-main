# Backend

# API Documentation

## Overview

This documentation describes the API endpoints created for managing products in the application. Two endpoints are provided: one for adding products and another for deleting products.

## Endpoints

### 1. Add Product

- **Endpoint**: `/api/products`
- **Method**: `POST`
- **Description**: This endpoint allows you to add a new product to the database.

#### Request Body

The request body must be a JSON object containing the following fields:

| Field        | Type   | Required | Description                                             |
| ------------ | ------ | -------- | --------------------------------------------------------|
| name         | string | Yes      | The name of the product.                                |
| price        | string | Yes      | The price of the product in the format `XX.XX`.         |
| description  | string | Yes      | A brief description of the product.                     |
| category     | string | Yes      | The category of the product.                            |
| rating       | number | Yes      | The rating of the product (0 to 5).                     |
| numReviews   | number | Yes      | The number of reviews for the product.                  |
| countInStock | number | Yes      | The quantity of the product available in stock.         |
| productType  | number | Yes      | The type of product, either `large` = 0 or `small` = 1. |

#### Example Request

POST /api/products
 ```
  {
  "name": "Oriental Fresh Shirt",
  "price": "82.00",
  "description": "A stylish shirt for all occasions.",
  "category": "Clothing",
  "rating": 4.5,
  "numReviews": 10,
  "countInStock": 50,
  "productType": 0 // 0 for large json file and 1 for small json file
  }
  ```

### Checking the new Product Info

 - You can check the new Product at the beginning of the `products.json` file
   - If your productType is 0 then check `src\mock\large\products.json`
   - If your productType is 1, then checko `src\mock\small\products.json`


## Response

- **Status Code**: `201 Created`
  - **Response Body**: The created product `id`.

### Error Responses

- **Status Code**: `400 Bad Request`
  - If the request body is missing required fields or contains invalid data.
- **Status Code**: `500 Internal Server Error`
  - If there is an error while adding the product.

### 2. Delete Product

- **Endpoint**: `/api/products/[id]`
- **Method**: `DELETE`
- **Description**: This endpoint allows you to delete a product by its ID.

#### URL Parameters

| Parameter | Type   | Required | Description                                     |
| --------- | ------ | -------- | ----------------------------------------------- |
| id        | string | Yes      | The unique identifier of the product to delete. |

#### Example Request

```http
DELETE /api/products/921f91dd-f40e-4752-9f2d-7e3c3bcde2b3
```

### Response

- **Status Code**: `200 OK`

  - If the product was successfully removed.
  - **Body**: A success message indicating the product was removed.

- **Status Code**: `404 Not Found`
  - If the product with the specified ID does not exist.
  - **Body**: An error message indicating the product was not found.

### Error Responses

- **Status Code**: `400 Bad Request`
  - If the ID parameter is invalid.
- **Status Code**: `500 Internal Server Error`
  - If there is an error while removing the product.

### Checking the new Product Info

 - You can check the new Product at the beginning of the `products.json` file
   - If your productType is 0 then check `src\mock\large\products.json`
   - If your productType is 1, then checko `src\mock\small\products.json`

## Utility Functions

### `addProduct(productType: EProductType, newProductData: TProduct): Promise<string>`

- Adds a new product to the appropriate JSON file based on its type (`large` or `small`).
- Returns the ID of the newly created product.

### `removeProduct(productId: string): string | undefined`

- Removes a product from the database based on its ID.
- Returns the ID of the removed product or `undefined` if not found.

### `removeProdutoFromDatabase(filePath: string, productId: string): boolean`

- Helper function to remove a product from a specific file.
- Returns `true` if the product was found and removed, otherwise `false`.

## Testing the API

To test the API endpoints, you can use tools like Postman or cURL.

### Create Product CURL

   ```
     curl --location --request POST 'http://localhost:3000/api/products' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Woody Toy",
    "price": "199.99",
    "description": "Woody is a loyal and brave cowboy toy. He is the leader of the toys and always ready to help his friends.",
    "category": "Toys",
    "rating": 4.8,
    "numReviews": 150,
    "countInStock": 75,
    "productType": 0
}'
   ```
   
   ### Delete Product CURL
  
   ```
     curl --location --request DELETE 'http://localhost:3000/api/products/valid-product-id'
   ```

### Testing the Add Product Endpoint

1. Set the request type to `POST`.
2. Enter the URL: `http://localhost:3000/api/products`.
3. Set the body to JSON and include the required fields.
4. Send the request and check the response.

### Testing the Delete Product Endpoint

1. Set the request type to `DELETE`.
2. Enter the URL: `http://localhost:3000/api/products/[id]` (replace `[id]` with a valid product ID).

## Testing

### Unit Tests

I have created unit tests for both the API endpoints and the utility functions. The tests for the utility functions were developed in such a way that they do not affect the actual JSON files. This ensures that the tests can be run safely without modifying any persistent data.

- **Endpoints Testing**: The tests validate the functionality of the API endpoints for adding and deleting products, ensuring that they behave as expected under various scenarios.

- **Utility Functions Testing**: The tests for utility functions verify the correctness of the logic used for adding and removing products, ensuring that they handle edge cases properly without impacting the underlying data.

These tests help maintain the integrity of the application and facilitate easier debugging and feature enhancements in the future.

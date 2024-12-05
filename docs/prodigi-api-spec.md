# Prodigi API Reference (v4) Overview

Welcome to the Prodigi API reference documentation for version 4. The Prodigi RESTful API uses standard HTTP response codes, authentication, and verbs. Payloads are in `application/json`, and responses are in `JSON` format.

## Getting Started

To place your first order, refer to the [guide](https://dashboard.prodigi.com/register). Sign up to get a free API key to access the API.

## Environments

- **Sandbox**: Testing environment, no charges applied, orders are not fulfilled.
  - API: `api.sandbox.prodigi.com`
  - Dashboard: [sandbox-beta-dashboard.pwinty.com](https://sandbox-beta-dashboard.pwinty.com)
- **Live**: Production environment, orders are fulfilled and shipped.
  - API: `api.prodigi.com`
  - Dashboard: [dashboard.prodigi.com](https://dashboard.prodigi.com)

## Authentication

Include the `X-API-Key` in the header of each request:

```shell
curl "https://api.prodigi.com/v4.0/Orders" \
  -X GET \
  -H "X-API-Key: your-api-key"
```

API credentials differ between Sandbox and Live.

## Orders

### Creating an Order

Orders are created with a single API request, and once submitted, they are processed according to your settings.

#### Example Request

```shell
curl "https://api.sandbox.prodigi.com/v4.0/Orders" \
  -X POST \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantReference": "MyMerchantReference1",
    "shippingMethod": "Overnight",
    "recipient": {
      "name": "Mr Testy McTestface",
      "address": {
        "line1": "14 test place",
        "postalOrZipCode": "12345",
        "countryCode": "US",
        "townOrCity": "somewhere"
      }
    },
    "items": [
      {
        "merchantReference": "item #1",
        "sku": "GLOBAL-CFPM-16X20",
        "copies": 1,
        "sizing": "fillPrintArea",
        "attributes": { "color": "black" },
        "assets": [
          {
            "printArea": "default",
            "url": "https://example.com/image.png",
            "md5Hash": "daa1c811c6038e718a23f0d816914b7b"
          }
        ]
      }
    ]
  }'
```

### Updating an Order

Use the following endpoint to update an existing order:

```shell
curl "https://api.sandbox.prodigi.com/v4.0/orders/{order_id}" \
  -X PUT \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
  "shippingMethod": "Express",
  "recipient": {
    "name": "Updated Name",
    "address": {
      "line1": "Updated address",
      "postalOrZipCode": "54321",
      "countryCode": "US",
      "townOrCity": "newplace"
    }
  }
}'
```

**Note**: Certain fields may not be updated once the order is being processed or has reached production.

### Canceling an Order

Use the following endpoint to cancel an order by its ID:

```shell
curl "https://api.sandbox.prodigi.com/v4.0/orders/{order_id}/cancel" \
  -X POST \
  -H "X-API-Key: your-api-key"
```

**Note**: Once an order is canceled, it cannot be resumed or re-activated.

### Order Object

- **`id`** (string): Unique order ID, set by Prodigi.
- **`created`** (string): UTC DateTime of creation.
- **`shippingMethod`** (string): Shipping type (`Budget`, `Standard`, `Express`, `Overnight`).
- **`recipient`**: Shipping name and address.
- **`items`**: Array of items to be fulfilled (products + assets).
- **`metadata`** (optional): Custom JSON object containing keys/values up to 2000 characters.

### Recipient Object

- **`name`** (string): Recipient's name.
- **`address`**: Address details including `line1`, `townOrCity`, `postalOrZipCode`, and `countryCode`.

## Creating an Order Outcome

- **`created`** (200): Order successfully created.
- **`onHold`** (200): Order created but on hold.
- **`alreadyExists`** (200): Order with the same `idempotencyKey` already exists.

## Getting an Order by ID

Use the following endpoint to retrieve an order by its ID:

```shell
curl "https://api.sandbox.prodigi.com/v4.0/orders/{order_id}" \
  -X GET \
  -H "X-API-Key: your-api-key"
```

## Listing Available Products

Use the following endpoint to get a list of products available to order:

```shell
curl "https://api.prodigi.com/v4.0/products" \
  -X GET \
  -H "X-API-Key: your-api-key"
```

This request will return a list of products, including details such as SKU, product type, size options, and available attributes.

### Example Response
```json
{
  "products": [
    {
      "sku": "GLOBAL-CFPM-16X20",
      "name": "16x20 Canvas Print",
      "attributes": [
        {
          "key": "color",
          "values": ["black", "white"]
        }
      ],
      "price": {
        "currency": "USD",
        "amount": "20.00"
      },
      "supportedRegions": ["US", "UK", "CA"]
    }
  ]
}
```

## Other API Endpoints

Here is a list of additional API endpoints with brief descriptions:

### 1. **Get Product Details**

- **Endpoint**: `/v4.0/products/{sku}`
- **Method**: GET
- **Description**: Retrieves detailed information for a specific product by its SKU.
- **Parameters**: `sku` (string, required) - The product SKU.
- **Return Object**: Product details including size, pricing, available attributes, and supported regions.

### Example Response
```json
{
  "sku": "GLOBAL-CFPM-16X20",
  "name": "16x20 Canvas Print",
  "price": {
    "currency": "USD",
    "amount": "20.00"
  },
  "attributes": [
    {
      "key": "color",
      "values": ["black", "white"]
    }
  ],
  "supportedRegions": ["US", "UK", "CA"]
}
```

### 2. **Get Shipping Rates**

- **Endpoint**: `/v4.0/shipping/rates`
- **Method**: POST
- **Description**: Get available shipping rates for a given set of items and address.
- **Parameters**: 
  - `recipient` (object, required): Contains shipping address information (`line1`, `postalOrZipCode`, `countryCode`, `townOrCity`).
  - `items` (array, required): List of items, each containing `sku` and `copies`.
- **Return Object**: List of shipping options, including shipping method, cost, and estimated delivery time.

### Example Response
```json
{
  "shippingOptions": [
    {
      "method": "Standard",
      "cost": {
        "amount": "5.00",
        "currency": "USD"
      },
      "estimatedDelivery": "2024-12-10"
    },
    {
      "method": "Express",
      "cost": {
        "amount": "15.00",
        "currency": "USD"
      },
      "estimatedDelivery": "2024-12-07"
    }
  ]
}
```

### 3. **Track Shipment**

- **Endpoint**: `/v4.0/orders/{order_id}/tracking`
- **Method**: GET
- **Description**: Retrieve tracking information for a specific order.
- **Parameters**: `order_id` (string, required) - The unique order ID.
- **Return Object**: Tracking details including carrier, tracking number, and status.

### Example Response
```json
{
  "trackingNumber": "1234567890",
  "carrier": "DHL",
  "status": "In Transit",
  "estimatedDelivery": "2024-12-09"
}
```

### 4. **List All Orders**

- **Endpoint**: `/v4.0/orders`
- **Method**: GET
- **Description**: Retrieve a list of all orders for your account.
- **Parameters**: Optional query parameters for filtering such as `status`, `createdAfter`, `createdBefore`, `page`, and `pageSize`.
- **Return Object**: Array of order objects including `id`, `status`, `created`, and other relevant fields.

### Example Request
```shell
curl "https://api.prodigi.com/v4.0/orders?page=1&pageSize=10" \
  -X GET \
  -H "X-API-Key: your-api-key"
```

### 5. **Get Order Status**

- **Endpoint**: `/v4.0/orders/{order_id}/status`
- **Method**: GET
- **Description**: Retrieve the current status of an order.
- **Parameters**: `order_id` (string, required) - The unique order ID.
- **Return Object**: Status object including `stage`, `issues`, and detailed progress information.

These additional endpoints provide more functionality to manage products, track orders, and get shipping rates efficiently.


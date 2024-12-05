# Topaz Image Enhancement API - Compact Specification

## Overview
The Topaz Image Enhancement API offers a suite of AI-driven tools for image transformation. Key features include upscaling, denoising, sharpening, face recovery, and more. The API aims for high fidelity, minimal data loss, and efficiency in processing time and cost.

### Features:
- **Upscaling**: Produces high-resolution images without artifacts.
- **Fidelity**: Improves images with minimal distortion.
- **Efficiency**: Optimized for cost-effectiveness and speed.

## Authentication
An API key is required for access. There are two methods to provide the key:
1. **Deprecated Method**: If your key begins with a specific string (`eyJhbGciOi...`), set it as an `Authorization` header with the prefix `Bearer`.
2. **Standard Method**: For all other keys (after Oct 8, 2024), use the `X-API-Key` header.

Contact support at [enterprise@topazlabs.com](mailto:enterprise@topazlabs.com) for assistance.

## API Restrictions
- **Rate Limits**: Requests may receive HTTP 429 responses if rate limits are exceeded. Use exponential backoff strategies.
- **HTTPS Only**: Only HTTPS is supported; HTTP requests redirect to HTTPS.
- **Request Size Limit**: Maximum size per request is 500MB (HTTP 413 error if exceeded).

## Available Models
### **Enhance Models**
- **Standard V2**: General-purpose, balances detail, sharpness, and noise reduction.
  - Parameters: `denoise`, `sharpen`, `fix_compression`
- **Low Resolution V2**: Improves clarity in low-resolution images like web graphics.
  - Parameters: `denoise`, `sharpen`, `fix_compression`
- **CGI**: Optimized for CGI and digital illustrations to enhance texture and detail.
  - Parameters: `denoise`, `sharpen`
- **High Fidelity V2**: Designed for professional photography, preserving intricate details.
  - Parameters: `denoise`, `sharpen`, `fix_compression`
- **Text Refine**: Enhances clarity of text and shapes within images.
  - Parameters: `denoise`, `sharpen`, `fix_compression`

### **Generative Models**
- **Redefine**: High-fidelity upscaling with an emphasis on creativity or detail for low-resolution and AI-generated images.
  - Parameters: `prompt`, `creativity`, `texture`, `denoise`, `sharpen`
- **Recovery**: High-fidelity upscaling for extremely low-resolution images, focusing on preserving detail.

## Parameters Overview
- **`denoise`**: Noise reduction level (0 to 1).
- **`sharpen`**: Adjust sharpness (0 to 1).
- **`fix_compression`**: Reduces compression artifacts (0 to 1).
- **`prompt`**: Descriptive text for image generation (max 1024 characters).
- **`creativity`**: Controls model creativity (1 to 6).
- **`texture`**: Amount of detail generated (1 to 5).

## Endpoints
### 1. **POST /enhance**
- **Description**: Enhance an image using one of the available models.
- **Parameters**:
  - **`model`** (required): Specifies which model to use (e.g., `Standard V2`, `CGI`).
  - **`denoise`** (optional): Noise reduction level (0 to 1).
  - **`sharpen`** (optional): Adjust sharpness (0 to 1).
  - **`fix_compression`** (optional): Reduces compression artifacts (0 to 1).
  - **`output_height`** (optional): Height of the output image.
  - **`output_width`** (optional): Width of the output image.
  - **`output_format`** (optional): Desired format of the output (e.g., `jpeg`, `png`).

- **Response**:
  - **`status`**: HTTP status code (e.g., `200 OK`).
  - **`image_url`**: URL to the enhanced image.
  - **`message`**: Any relevant message or error description.

### 2. **POST /generate**
- **Description**: Generate a new enhanced image using the generative models.
- **Parameters**:
  - **`model`** (required): Specifies which generative model to use (e.g., `Redefine`, `Recovery`).
  - **`prompt`** (required for `Redefine`): Descriptive text for the desired image.
  - **`creativity`** (optional): Adjusts creativity level (1 to 6).
  - **`texture`** (optional): Amount of detail to be generated (1 to 5).
  - **`denoise`** (optional): Extra noise reduction (0 to 1).
  - **`sharpen`** (optional): Additional sharpening (0 to 1).

- **Response**:
  - **`status`**: HTTP status code (e.g., `202 Accepted` for asynchronous processing).
  - **`job_id`**: Unique identifier for tracking the request.
  - **`message`**: Status message or error details.

### 3. **GET /status/{job_id}**
- **Description**: Retrieve the status of an asynchronous image generation job.
- **Parameters**:
  - **`job_id`** (required): The unique identifier for the job to check status.

- **Response**:
  - **`status`**: Current status of the job (e.g., `processing`, `completed`).
  - **`image_url`** (if completed): URL to the generated image.
  - **`message`**: Any relevant message or error description.

## Usage
Models and parameters should be included as key-value pairs in form-data requests. If parameters are not explicitly provided, they are automatically configured by the system.

### Example Request Headers
- **Authentication**: `Authorization: Bearer <API_KEY>` or `X-API-Key: <API_KEY>`
- **Base URL**: `https://api.topazlabs.com/image/v1`

## Contact
For further inquiries, reach out to [enterprise@topazlabs.com](mailto:enterprise@topazlabs.com).

For more information, visit [Topaz Labs API](https://www.topazlabs.com/api).


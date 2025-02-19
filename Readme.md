# Project Name

A full-stack application for managing products with CRUD operations, image upload, filtering, sorting, and pagination. This project includes a NestJS backend and a React frontend, all containerized with Docker.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Running Locally](#running-locally)
  - [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Development](#development)

---

## Features

- **Product Management**: Create, read, update, and delete products.
- **Image Upload**: Upload product images via multipart/form-data.
- **Filtering & Sorting**: Filter and sort products on both frontend and backend.
- **Pagination**: Efficient pagination for product listings.
- **Hot Module Reloading**: Instant feedback on code changes for both backend and frontend.
- **Docker Integration**: Containerized development and production environments using Docker Compose.
- **Temporary Build Directory**: The backend uses a temporary `dist` folder (tmpfs) which is automatically cleaned up when the container stops.

---

## Tech Stack

- **Backend**: 
  - [NestJS](https://nestjs.com/)
  - [Webpack](https://webpack.js.org/) with Hot Module Replacement (HMR)
  - TypeORM
  - Multer (for file uploads)
- **Frontend**: 
  - [React](https://reactjs.org/)
  - [Webpack](https://webpack.js.org/) with Hot Module Replacement (HMR)
  - Material UI
  - Tanstack Query
  - react-hook-form and Zod for form validation
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose

---

## Project Structure

```plaintext
project-root/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── product/
│   │       ├── dto/
│   │       │   ├── create-product.dto.ts
│   │       │   └── update-product.dto.ts
│   │       ├── product.controller.ts
│   │       ├── product.entity.ts
│   │       ├── product.module.ts
│   │       └── product.service.ts
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js
│   ├── Dockerfile.dev
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Setup and Installation

### Docker Setup

The project is fully containerized using Docker Compose.

1. **Build and run containers:**

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the backend and frontend containers.
   - Start PostgreSQL as the database.
   - Use a temporary volume (tmpfs) for the backend's `dist` directory.
   - Map ports:
     - Backend: `http://localhost:3000`
     - Frontend: `http://localhost:3001` (Nginx serves the production build or webpack-dev-server for development)

2. **Hot Reload (Development):**

   - **Backend**: Uses webpack HMR with NestJS.
   - **Frontend**: Uses Webpack Dev Server with HMR.  
     Ensure you are running the `start:dev` script in the frontend container.

---

## Usage

- **Backend API Endpoints:**
  - `POST /products`: Create a new product with image upload (multipart/form-data).
  - `GET /products`: Get list of products with filtering, sorting, and pagination.
  - `GET /products/:id`: Get details of a specific product.
  - `PUT /products/:id`: Update product details and optionally replace image.
  - `DELETE /products/:id`: Delete a product.

- **Frontend:**
  - A user-friendly interface for managing products, including forms for creating and editing products, a product listing page with search, filtering, sorting, and pagination.

---


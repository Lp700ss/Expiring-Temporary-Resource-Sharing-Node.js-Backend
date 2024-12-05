# Expiring-Temporary-Resource-Sharing-Node.js-Backend
# Temporary Service CMS

This project is a Node.js-based Content Management System (CMS) designed to handle resources with user access control, including sharing and expiration features. Below is the complete documentation to understand, set up, and use the system.

---

## **Table of Contents**

1. [Setup Instructions](#setup-instructions)
2. [Project Folder Structure](#project-folder-structure)
3. [API Endpoints](#api-endpoints)
    - [GET /resources](#get-resources)
    - [GET /resources/:id](#get-resource-by-id)
    - [DELETE /resources/:id](#delete-resource)
4. [Expiration Logic](#expiration-logic)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)

---

## **Setup Instructions**

Follow these steps to set up the project on your local machine:

### **1. Prerequisites**

- Node.js (v16 or above)
- MySQL Database
- A package manager like npm or yarn

### **2. Clone the Repository**

```bash
$ git clone <repository_url>
$ cd temporary-service-cms
```

### **3. Install Dependencies**

```bash
$ npm install
```

### **4. Configure Environment Variables**

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
JWT_SECRET=<your_jwt_secret>
DB_HOST=<your_database_host>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_NAME=<your_database_name>
```

### **5. Run Database Migrations**

```bash
$ npx sequelize-cli db:migrate
```

### **6. Start the Server**

```bash
$ node server.js
```

The server will run at `http://localhost:3000`.

---

## **Project Folder Structure**

The folder structure of the project is as follows:

```
TEMPORARY-SERVICE-CMS/
├── config/
│   └── db.js
├── controllers/
│   ├── resource.controller.js
│   ├── sharedResource.controller.js
│   └── user.controller.js
├── cron/
│   └── expire-resources.js
├── middleware/
│   ├── auth.js
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── upload.middleware.js
├── migrations/
│   ├── 20241202091359-add-tables.js
│   └── add_indexes.js
├── models/
│   ├── index.js
│   ├── resource.model.js
│   ├── resourceShare.model.js
│   └── user.model.js
├── routes/
│   ├── resource.routes.js
│   ├── resourceShare.route.js
│   └── user.routes.js
├── uploads/                          # Directory for uploaded files
├── utils/
│   └── generateToken.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js


---

## **API Endpoints**

Below is a detailed explanation of the API endpoints provided by the system:

### **GET /resources**

Fetch all resources for the logged-in user with optional filters.

- **URL**: `/resources`
- **Method**: GET
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status=active`
  - `status=expired`
- **Response**:

```json
[
  {
    "id": 1,
    "resource_url": "https://example.com/resource1",
    "status": "active",
    "expiration_time": "2024-12-31T23:59:59.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "resource_url": "https://example.com/resource2",
    "status": "expired",
    "expiration_time": "2024-06-30T23:59:59.000Z",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### **GET /resources/:id**

Access a specific resource if it is active.

- **URL**: `/resources/:id`
- **Method**: GET
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:

```json
{
  "id": 1,
  "resource_url": "https://example.com/resource1",
  "status": "active",
  "expiration_time": "2024-12-31T23:59:59.000Z",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### **DELETE /resources/:id**

Delete a resource. Only the owner of the resource can delete it.

- **URL**: `/resources/:id`
- **Method**: DELETE
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:

```json
{
  "message": "Resource deleted successfully."
}
```

---

## **Expiration Logic**

The expiration logic ensures resources and shared resources are accessible only within their valid timeframe. Here's how it works:

1. **Resources**:
   - A `resource` has an `expiration_time` column.
   - Any resource past its `expiration_time` is marked as `expired`.
   - This logic is enforced in the database queries and checked during resource access (GET endpoints).

2. **Shared Resources**:
   - A shared resource includes an `expiration_time` column.
   - Users cannot access shared resources after their expiration.

3. **Token Expiry**:
   - JWT tokens are signed with an `expiresIn` value (e.g., `1h`).
   - Once the token expires, users must reauthenticate to obtain a new token.

---

## **Environment Variables**

Ensure the following environment variables are set for the application to function correctly:

| Variable         | Description                         |
|------------------|-------------------------------------|
| `PORT`           | Port on which the server runs       |
| `JWT_SECRET`     | Secret key for signing JWT tokens   |
| `DB_HOST`        | Hostname of the MySQL database      |
| `DB_USER`        | MySQL database username            |
| `DB_PASSWORD`    | MySQL database password            |
| `DB_NAME`        | Name of the MySQL database         |

---

## **Database Schema**

Below is the SQL script to create the required tables:

### **Resources Table**

```sql
CREATE TABLE `resources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resource_url` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'expired') NOT NULL DEFAULT 'active',
  `expiration_time` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Users Table**

```sql
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

This documentation provides all necessary information to understand and use the system effectively. For additional questions or support, please contact the repository maintainer.

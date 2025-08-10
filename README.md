# Prodigious Event Management System

This Event Management System is a task from Publicis Groupe (Prodigious). It's a mini event management platform where users can:
- View a list of upcoming events
- Register for an event
- (Admin only) Create, edit, or delete events

The system is built using a modern full-stack architecture:

- Frontend: React 19.1.1 (Port 3000)
- Backend: Laravel 12.0 with PHP 8.2+ (Port 8000)
- Database: MySQL 8.0 (Port 3307)
- Web Server: Nginx (Reverse proxy)
- Containerization: Docker & Docker Compose

Before running this system, ensure you have the following installed on your machine:

1. Docker Desktop (v4.0 or higher)
   - Download from: https://docs.docker.com/desktop/
   - Make sure Docker Engine is running

2. Git (for cloning the repository)
   - Download from: https://git-scm.com/downloads

3. System Requirements:
   - Windows 10/11, macOS 10.15+, or Linux
   - Minimum 4GB RAM (8GB recommended)
   - At least 5GB free disk space

1. Clone the Repository

git clone https://github.com/afiqbaharuddin/prodigious-event-management.git
cd prodigious-event-management

2. Environment Setup

Backend Configuration
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Return to root directory
cd ..

3. Build and Run with Docker

# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build

4. Initialize Laravel Application

After the containers are running, set up the Laravel backend:

# Generate application key
docker-compose exec backend php artisan key:generate

# Run database migrations
docker-compose exec backend php artisan migrate

# (Optional) Seed the database with sample data
docker-compose exec backend php artisan db:seed

### 5. Access the Application

- **Frontend (React)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/api/documentation
- **API Overview Page**: http://localhost:8000/api.html
- **Database**: localhost:3307

Development Commands

Docker Management
# Start services
docker-compose up

# Stop services
docker-compose down

# Restart a specific service
docker-compose restart backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers
docker-compose up --build

Backend (Laravel) Commands
# Access backend container
docker-compose exec backend bash

# Run migrations
docker-compose exec backend php artisan migrate

# Create new migration
docker-compose exec backend php artisan make:migration create_table_name

# Run tests
docker-compose exec backend php artisan test

# Clear cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

Frontend (React) Commands
# Access frontend container
docker-compose exec frontend bash

# Install new packages
docker-compose exec frontend npm install package-name

# Run tests
docker-compose exec frontend npm test

Database Information

- Database Name: event_management
- Username: root / laravel
- Password: password
- Host: mysql (container) / localhost (external)
- Port: 3306 (internal) / 3307 (external)

External Database Connection
To connect from external tools (like MySQL Workbench, phpMyAdmin):
- Host: localhost
- Port: 3307
- Username: root
- Password: password

## 📚 API Documentation

This project includes comprehensive API documentation using **Swagger/OpenAPI 3.0** specification.

### 🔗 Access API Documentation

- **Swagger UI**: http://localhost:8000/api/documentation
- **JSON Schema**: http://localhost:8000/docs/api-docs.json
- **YAML Schema**: http://localhost:8000/docs/api-docs.yaml

### 📋 API Overview

The API provides the following endpoints:

#### Authentication Endpoints
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user and get access token
- `POST /api/logout` - Logout user (revoke token)
- `GET /api/user` - Get authenticated user information

#### Event Endpoints
- `GET /api/events` - Get all events (with search, filter, pagination)
- `GET /api/events/{id}` - Get specific event details
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/{id}` - Update event (Admin only)
- `DELETE /api/events/{id}` - Delete event (Admin only)

#### Registration Endpoints
- `POST /api/events/{id}/register` - Register for an event
- `GET /api/registrations` - Get user's registrations
- `DELETE /api/registrations/{id}` - Cancel registration

### 🔐 Authentication

The API uses **Bearer Token** authentication (Laravel Sanctum):

```bash
# Login to get token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 📝 API Examples

#### Register a New User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

#### Get All Events
```bash
curl -X GET "http://localhost:8000/api/events?search=tech&location=center&page=1"
```

#### Create an Event (Admin)
```bash
curl -X POST http://localhost:8000/api/events \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "location": "Convention Center",
    "start_date": "2025-09-01 09:00:00",
    "end_date": "2025-09-01 17:00:00",
    "max_participants": 100
  }'
```

#### Register for an Event
```bash
curl -X POST http://localhost:8000/api/events/1/register \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 🔄 Response Format

All API responses follow a consistent JSON format:

#### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "meta": { ... }
}
```

#### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### 📊 Pagination

List endpoints support pagination:
```json
{
  "current_page": 1,
  "data": [...],
  "total": 50,
  "per_page": 10,
  "last_page": 5
}
```

### 🛠️ Regenerate Documentation

To regenerate the API documentation after making changes:

```bash
# Regenerate Swagger documentation
docker-compose exec backend php artisan l5-swagger:generate
```

## 🔧 Configuration Details

Environment Variables

#Backend (.env)
APP_NAME=Prodigious Event Management
APP_URL=http://localhost:8000
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=event_management
DB_USERNAME=root
DB_PASSWORD=password

#Frontend
REACT_APP_API_URL=http://localhost:8000

Troubleshooting

Common Issues

1. Port Already in Use
   # Check what's using the port
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   
   # Stop Docker containers
   docker-compose down

2. Database Connection Issues
   # Restart MySQL container
   docker-compose restart mysql
   
   # Check if MySQL is ready
   docker-compose logs mysql

3. Laravel Key Not Generated
   docker-compose exec backend php artisan key:generate

4. Permission Issues (Linux/Mac)
   # Fix storage permissions
   docker-compose exec backend chown -R www-data:www-data /var/www/storage
   docker-compose exec backend chmod -R 775 /var/www/storage

5. Node Modules Issues
   # Rebuild frontend container
   docker-compose build --no-cache frontend
   docker-compose up frontend

Logs and Debugging
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f backend

Testing

### Backend Tests
```bash
# Run all tests
docker-compose exec backend php artisan test

# Run specific test
docker-compose exec backend php artisan test --filter=TestName
```

### Frontend Tests
```bash
# Run React tests
docker-compose exec frontend npm test
```
CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline using GitHub Actions that automatically:

### Automated Testing
- **Backend Tests**: Runs PHPUnit tests with MySQL database
- **Frontend Tests**: Runs React tests with coverage reporting
- **Code Quality**: Laravel Pint for PHP code style, ESLint for JavaScript
- **Security Scanning**: Trivy vulnerability scanner for dependencies and Docker images

### Build Verification
- **Docker Build**: Tests both backend and frontend Docker image builds
- **Docker Compose**: Validates docker-compose configuration

### Deployment
- **Automatic Deployment**: Deploys to production on main branch pushes (when configured)
- **Release Management**: Creates releases and builds Docker images for tagged versions

### Workflow Triggers
- **Pull Requests**: All checks run on PRs to main branch
- **Push to Main**: Full pipeline including optional deployment
- **Weekly Dependencies**: Automated dependency updates every Monday

### Setting Up CI/CD

#### Required GitHub Secrets
For the full CI/CD pipeline to work, add these secrets in your GitHub repository settings:

```
DOCKER_USERNAME     # Your Docker Hub username
DOCKER_PASSWORD     # Your Docker Hub password or access token
```

#### Pipeline Status
You can check the pipeline status with badges in your README:

```markdown
![CI/CD Pipeline](https://github.com/afiqbaharuddin/prodigious-event-management/workflows/CI/CD%20Pipeline/badge.svg)
![Security Scan](https://github.com/afiqbaharuddin/prodigious-event-management/workflows/Security%20Scan/badge.svg)
```

#### Workflow Files
The CI/CD configuration includes:
- `.github/workflows/ci.yml` - Main CI/CD pipeline
- `.github/workflows/release.yml` - Release automation
- `.github/workflows/dependencies.yml` - Dependency updates

### Manual Deployment
If you prefer manual deployment, you can trigger workflows manually from the GitHub Actions tab.

Project Structure
prodigious-event-management/
├── .github/                # GitHub Actions CI/CD workflows
│   └── workflows/          # CI/CD pipeline definitions
├── backend/                # Laravel API
│   ├── app/                # Application logic
│   ├── database/           # Migrations, seeders
│   ├── routes/             # API routes
│   └── ...
├── frontend/               # React application
│   ├── src/                # React components
│   ├── public/             # Static files
│   └── ...
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Docker services
└── README.md              # This file
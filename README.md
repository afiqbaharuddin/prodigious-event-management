# Prodigious Event Management System

This Event Management System is a task from Publicis Groupe (Prodigious). It's a mini event management platform where users can:
- View a list of upcoming events
- Register for an event
- (Admin only) Create, edit, or delete events

## 🏗️ System Architecture

The system is built using a modern full-stack architecture:

- **Frontend**: React 19.1.1 (Port 3000)
- **Backend**: Laravel 12.0 with PHP 8.2+ (Port 8000)
- **Database**: MySQL 8.0 (Port 3307)
- **Web Server**: Nginx (Reverse proxy)
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before running this system, ensure you have the following installed on your machine:

1. **Docker Desktop** (v4.0 or higher)
   - Download from: https://docs.docker.com/desktop/
   - Make sure Docker Engine is running

2. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/downloads

3. **System Requirements**:
   - Windows 10/11, macOS 10.15+, or Linux
   - Minimum 4GB RAM (8GB recommended)
   - At least 5GB free disk space

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/afiqbaharuddin/prodigious-event-management.git
cd prodigious-event-management
```

### 2. Environment Setup

#### Backend Configuration
```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Return to root directory
cd ..
```

### 3. Build and Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. Initialize Laravel Application

After the containers are running, set up the Laravel backend:

```bash
# Generate application key
docker-compose exec backend php artisan key:generate

# Run database migrations
docker-compose exec backend php artisan migrate

# (Optional) Seed the database with sample data
docker-compose exec backend php artisan db:seed
```

### 5. Access the Application

- **Frontend (React)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8000
- **Database**: localhost:3307

## 🛠️ Development Commands

### Docker Management
```bash
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
```

### Backend (Laravel) Commands
```bash
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
```

### Frontend (React) Commands
```bash
# Access frontend container
docker-compose exec frontend bash

# Install new packages
docker-compose exec frontend npm install package-name

# Run tests
docker-compose exec frontend npm test
```

## 📊 Database Information

- **Database Name**: event_management
- **Username**: root / laravel
- **Password**: password
- **Host**: mysql (container) / localhost (external)
- **Port**: 3306 (internal) / 3307 (external)

### External Database Connection
To connect from external tools (like MySQL Workbench, phpMyAdmin):
- Host: localhost
- Port: 3307
- Username: root
- Password: password

## 🔧 Configuration Details

### Environment Variables

#### Backend (.env)
```
APP_NAME=Prodigious Event Management
APP_URL=http://localhost:8000
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=event_management
DB_USERNAME=root
DB_PASSWORD=password
```

#### Frontend
```
REACT_APP_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   
   # Stop Docker containers
   docker-compose down
   ```

2. **Database Connection Issues**
   ```bash
   # Restart MySQL container
   docker-compose restart mysql
   
   # Check if MySQL is ready
   docker-compose logs mysql
   ```

3. **Laravel Key Not Generated**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```

4. **Permission Issues (Linux/Mac)**
   ```bash
   # Fix storage permissions
   docker-compose exec backend chown -R www-data:www-data /var/www/storage
   docker-compose exec backend chmod -R 775 /var/www/storage
   ```

5. **Node Modules Issues**
   ```bash
   # Rebuild frontend container
   docker-compose build --no-cache frontend
   docker-compose up frontend
   ```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f backend
```

## 🧪 Testing

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

## 📁 Project Structure

```
prodigious-event-management/
├── backend/                 # Laravel API
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
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need Help?** If you encounter any issues during setup, please check the troubleshooting section above or create an issue in the repository.

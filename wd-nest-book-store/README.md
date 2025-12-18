# NestJS Bookstore API

A REST API for a bookstore application built with NestJS, TypeORM, and PostgreSQL.

## Features

- 📚 Book management with categories
- 🖼️ Book cover images served via Nginx
- 👍 Like system for books
- 🐳 Fully dockerized with hot-reload for development
- 🔄 Auto-generated mock data on startup

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Database
- **Nginx** - Static file server and reverse proxy
- **Docker** - Containerization

## Quick Start with Docker

### Prerequisites

- Docker Desktop installed and running
- No other services running on ports 3080, 3000, or 5432

### Running the Application

1. **Start all services** (Postgres, NestJS app, and Nginx):
   ```bash
   docker-compose up
   ```

   Or run in the background:
   ```bash
   docker-compose up -d
   ```

2. **Wait for the services to start**. You'll see:
   ```
   [FixturesService] Fixtures loaded successfully!
   [NestApplication] Nest application successfully started
   ```

3. **Access the API**:
   - API (direct): `http://localhost:3000/api`
   - API (via Nginx): `http://localhost:3080/api`
   - Static images: `http://localhost:3080/images/books/`

### Stopping the Application

```bash
docker-compose down
```

To remove volumes (resets database):
```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Development Mode

The app runs in hot-reload mode. Edit files in `src/` and changes will auto-reload.

## API Endpoints

### Books
- `GET /api/book` - Get all books (category shows only id and name)
- `GET /api/book/:id` - Get book by ID (full category details)
- `POST /api/book` - Create a book
- `PATCH /api/book/:id` - Update a book
- `DELETE /api/book/:id` - Delete a book
- `POST /api/book/:id/like` - Increment book like count

### Book Categories
- `GET /api/book-category` - Get all categories
- `GET /api/book-category/:id` - Get category by ID
- `POST /api/book-category` - Create a category
- `PATCH /api/book-category/:id` - Update a category
- `DELETE /api/book-category/:id` - Delete a category

## Static Assets

Book cover images are stored in `dep/mock_public/images/books/` and served by Nginx.

### Accessing Images

Images are accessible at: `http://localhost:3080/images/books/{filename}.jpg`

Example:
```
http://localhost:3080/images/books/great-gatsby.jpg
http://localhost:3080/images/books/1984.jpg
```

### Adding New Images

1. Place your image in `dep/mock_public/images/books/`
2. Update the book's `coverUrl` field to `/images/books/your-image.jpg`
3. The image will be immediately available via Nginx

## Mock Data

The application automatically loads mock data on startup (development mode only):
- 5 book categories (Fiction, Sci-Fi, Non-Fiction, Programming, Biography)
- 10 books with covers, prices, and initial like counts

Mock data is cleared and reloaded every time the app starts when:
- `NODE_ENV=development`
- `DB_NAME` ends with `-dev`

## Environment Variables

Key variables in `docker-compose.yml`:
```yaml
DB_HOST: postgres          # Database host
DB_PORT: 5432             # Database port
DB_USERNAME: postgres      # Database user
DB_PASSWORD: postgres      # Database password
DB_NAME: bookstore-dev    # Database name (ends with -dev for auto-reset)
NODE_ENV: development     # Environment mode
```

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
1. Check what's using the port: `netstat -ano | findstr :3080` (Windows)
2. Stop the service or change the port in `docker-compose.yml`

### Database Connection Issues
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres
```

### App Not Starting
```bash
# Rebuild containers
docker-compose up --build

# Reset everything
docker-compose down -v
docker-compose up --build
```

## Running Without Docker

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update `.env`:
   ```
   DB_HOST=localhost
   DB_NAME=bookstore-dev
   NODE_ENV=development
   ```

3. Start PostgreSQL locally (port 5432)

4. Run the app:
   ```bash
   npm run start:dev
   ```

## Project Structure

```
├── src/
│   ├── book/              # Book module (entity, service, controller)
│   ├── book-category/     # Category module
│   ├── fixtures/          # Mock data loader
│   └── main.ts           # Application entry point
├── dep/
│   └── mock_public/
│       └── images/books/  # Book cover images
├── docker-compose.yml     # Docker services configuration
├── Dockerfile            # App container build instructions
└── nginx.conf            # Nginx configuration
```

## Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Docker Documentation](https://docs.docker.com)

## License

MIT

# Treehouse - AI-Powered Vacation Rental Platform

![Treehouse Screenshot](./screenshot.png)

> A full-stack vacation rental platform with AI-generated listing descriptions, built with a microservices architecture using Next.js, Go, Python, and PostgreSQL.

## 🎯 Overview

Treehouse is a modern vacation rental platform that helps hosts create compelling property listings using AI. The application demonstrates a sophisticated microservices architecture, combining high-performance Go backend services with Python-based AI processing, all wrapped in a beautiful, responsive Next.js frontend.

### Key Features

- 🤖 **AI-Powered Listing Generation**: Automatically generates engaging property descriptions using Google's Gemini AI
- 🏗️ **Microservices Architecture**: Separated concerns with Go for API performance and Python for AI processing
- 🎨 **Modern UI/UX**: Beautiful, responsive design with a nature-inspired green theme
- 📊 **Full-Stack Implementation**: Complete frontend, backend, and database solution
- 🔄 **Real-Time Processing**: Seamless integration between frontend, API, and AI services

## 🏗️ Architecture

```
┌─────────────────┐
│  Next.js        │  Frontend (React/TypeScript)
│  Frontend       │  - Property browsing & search
│  Port: 3000     │  - Listing creation form
│                 │  - AI-generated descriptions
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Go Backend     │  Main API (Golang)
│  Port: 8080     │  - RESTful endpoints
│                 │  - Database operations
│                 │  - Service orchestration
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│PostgreSQL│ │ Python AI   │
│Database │ │ Service      │
│Port:5432│ │ Port: 8001   │
└─────────┘ └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ Gemini API   │
            │ (External)   │
            └──────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Go (Golang)** - High-performance API server
- **Gorilla Mux** - HTTP router and URL matcher
- **GORM** - ORM for database operations

### AI Service
- **Python 3.13** - AI processing service
- **FastAPI** - Modern, fast web framework
- **Google Gemini API** - Natural language generation

### Database
- **PostgreSQL 14** - Relational database with JSONB support

### DevOps
- **Docker** - Containerized PostgreSQL
- **Environment-based Configuration** - Flexible deployment setup

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- Python 3.13+
- Node.js 18+
- Docker & Docker Compose
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd airbnbclone
   ```

2. **Start PostgreSQL**
   ```bash
   docker-compose up -d postgres
   ```

3. **Set up Python AI Service**
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   export GEMINI_API_KEY=your_api_key_here
   uvicorn main:app --reload --port 8001
   ```

4. **Set up Go Backend**
   ```bash
   cd backend
   go mod download
   export DATABASE_URL=postgres://hostai:hostai123@localhost:5432/hostai?sslmode=disable
   export AI_SERVICE_URL=http://localhost:8001
   export PORT=8080
   go run main.go
   ```

5. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
   npm run dev
   ```

6. **Visit the application**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md).

## 📸 Screenshots

![Application Demo](./demo.gif)

*Add your GIF demo here showing the listing creation flow*

## 🎯 Project Highlights

- **Microservices Design**: Demonstrates separation of concerns with independent, scalable services
- **AI Integration**: Real-world application of large language models for content generation
- **Full-Stack Development**: Complete implementation from database to user interface
- **Modern Best Practices**: TypeScript, RESTful APIs, environment configuration, error handling
- **Production-Ready Architecture**: Structured for scalability and maintainability

## 📁 Project Structure

```
airbnbclone/
├── backend/              # Go backend API
│   ├── main.go         # Main server with routes
│   └── go.mod          # Go dependencies
├── ai-service/          # Python/FastAPI AI service
│   ├── main.py         # FastAPI app with Gemini integration
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── app/
│   │   ├── page.tsx    # Homepage with listings
│   │   ├── create/     # Listing creation form
│   │   └── listings/   # Listing detail pages
│   └── package.json
├── database/
│   └── schema.sql      # PostgreSQL schema
└── docker-compose.yml  # Local development setup
```

## 🔧 API Endpoints

### Go Backend
- `GET /health` - Health check
- `POST /listings/create` - Create listing with AI-generated description
- `GET /listings/:id` - Get listing by ID

### Python AI Service
- `GET /health` - Health check
- `POST /generate_description` - Generate listing description from host facts

## 🧪 Testing

Test the API endpoints:

```bash
# Test AI service
curl -X POST http://localhost:8001/generate_description \
  -H "Content-Type: application/json" \
  -d '{
    "host_input_facts": {
      "location": "Tuscaloosa, AL",
      "amenities": "Pool, Gym",
      "vibe": "Modern",
      "capacity": "5 guests"
    }
  }'

# Test backend
curl http://localhost:8080/health
```

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Image upload functionality
- [ ] Search and filtering capabilities
- [ ] Booking system
- [ ] Payment integration
- [ ] Review and rating system
- [ ] Email notifications
- [ ] Admin dashboard

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a portfolio project demonstrating full-stack development skills and modern architecture patterns.

---

**Note**: This project was built to showcase technical skills and architectural understanding. It demonstrates proficiency in multiple languages, frameworks, and design patterns commonly used in production environments.

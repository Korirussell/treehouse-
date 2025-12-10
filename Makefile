.PHONY: help setup db-up db-down ai-service backend frontend all clean

help:
	@echo "HostAI MVP - Available commands:"
	@echo "  make setup      - Install all dependencies"
	@echo "  make db-up      - Start PostgreSQL database"
	@echo "  make db-down    - Stop PostgreSQL database"
	@echo "  make ai-service - Run Python AI service"
	@echo "  make backend    - Run Go backend"
	@echo "  make frontend   - Run Next.js frontend"
	@echo "  make all        - Start all services (database, AI service, backend, frontend)"
	@echo "  make clean      - Clean up generated files"

setup:
	@echo "Setting up dependencies..."
	@cd ai-service && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@cd backend && go mod download
	@cd frontend && npm install
	@echo "Setup complete! Don't forget to:"
	@echo "  1. Set GEMINI_API_KEY environment variable"
	@echo "  2. Create .env files in backend/ and frontend/ directories"

db-up:
	docker-compose up -d postgres
	@echo "Database starting... wait a few seconds before using"

db-down:
	docker-compose down

ai-service:
	@echo "Starting AI service..."
	@cd ai-service && . venv/bin/activate && uvicorn main:app --reload --port 8001

backend:
	@echo "Starting Go backend..."
	@cd backend && go run main.go

frontend:
	@echo "Starting Next.js frontend..."
	@cd frontend && npm run dev

all:
	@echo "Starting all services..."
	@make db-up
	@sleep 3
	@echo "Services started! Run each service in separate terminals:"
	@echo "  Terminal 1: make ai-service"
	@echo "  Terminal 2: make backend"
	@echo "  Terminal 3: make frontend"

clean:
	@echo "Cleaning up..."
	@rm -rf frontend/.next
	@rm -rf frontend/node_modules
	@rm -rf ai-service/venv
	@rm -rf ai-service/__pycache__
	@rm -rf backend/*.test
	@echo "Clean complete"


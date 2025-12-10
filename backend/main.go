package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Listing represents a listing in the database
type Listing struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	HostInputFacts  string         `json:"host_input_facts" gorm:"type:jsonb"`
	AIDescription   string         `json:"ai_description" gorm:"type:text"`
	CreatedAt       time.Time      `json:"created_at"`
}

// CreateListingRequest represents the request body for creating a listing
type CreateListingRequest struct {
	HostInputFacts map[string]interface{} `json:"host_input_facts"`
}

// CreateListingResponse represents the response after creating a listing
type CreateListingResponse struct {
	ID              uint                   `json:"id"`
	HostInputFacts  map[string]interface{} `json:"host_input_facts"`
	AIDescription   string                 `json:"ai_description"`
	CreatedAt       string                 `json:"created_at"`
}

// GenerateDescriptionRequest for AI service
type GenerateDescriptionRequest struct {
	HostInputFacts map[string]interface{} `json:"host_input_facts"`
}

// GenerateDescriptionResponse from AI service
type GenerateDescriptionResponse struct {
	Description string `json:"description"`
}

var db *gorm.DB
var aiServiceURL string

func main() {
	// Load environment variables
	databaseURL := getEnv("DATABASE_URL", "postgres://hostai:hostai123@localhost:5432/hostai?sslmode=disable")
	aiServiceURL = getEnv("AI_SERVICE_URL", "http://localhost:8001")
	port := getEnv("PORT", "8080")

	// Connect to database
	var err error
	db, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate the schema
	err = db.AutoMigrate(&Listing{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connected successfully")

	// Setup routes
	r := mux.NewRouter()
	r.HandleFunc("/health", healthCheck).Methods("GET")
	r.HandleFunc("/listings/create", createListing).Methods("POST")
	r.HandleFunc("/listings/{id}", getListing).Methods("GET")

	// CORS middleware
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

	handler := corsMiddleware(r)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "backend",
	})
}

func createListing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req CreateListingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	// DEBUG: Log what we received
	log.Printf("📥 Received request with host_input_facts:")
	factsJSONDebug, _ := json.MarshalIndent(req.HostInputFacts, "", "  ")
	log.Printf("%s", factsJSONDebug)

	// Convert host input facts to JSON string for storage
	factsJSON, err := json.Marshal(req.HostInputFacts)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error marshaling facts: %v", err), http.StatusInternalServerError)
		return
	}

	// Call AI service to generate description
	aiReq := GenerateDescriptionRequest{
		HostInputFacts: req.HostInputFacts,
	}

	aiReqJSON, err := json.Marshal(aiReq)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error preparing AI request: %v", err), http.StatusInternalServerError)
		return
	}

	// DEBUG: Log what we're sending to AI service
	log.Printf("📤 Sending to AI service:")
	log.Printf("%s", string(aiReqJSON))

	// Make HTTP request to AI service
	aiResp, err := http.Post(aiServiceURL+"/generate_description", "application/json", 
		bytes.NewBuffer(aiReqJSON))
	if err != nil {
		http.Error(w, fmt.Sprintf("Error calling AI service: %v", err), http.StatusInternalServerError)
		return
	}
	defer aiResp.Body.Close()

	if aiResp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(aiResp.Body)
		log.Printf("❌ AI service error (status %d): %s", aiResp.StatusCode, string(bodyBytes))
		http.Error(w, fmt.Sprintf("AI service returned an error (status %d): %s", aiResp.StatusCode, string(bodyBytes)), http.StatusInternalServerError)
		return
	}

	var aiResponse GenerateDescriptionResponse
	if err := json.NewDecoder(aiResp.Body).Decode(&aiResponse); err != nil {
		http.Error(w, fmt.Sprintf("Error decoding AI response: %v", err), http.StatusInternalServerError)
		return
	}

	// Create listing in database
	listing := Listing{
		HostInputFacts: string(factsJSON),
		AIDescription:  aiResponse.Description,
	}

	if err := db.Create(&listing).Error; err != nil {
		http.Error(w, fmt.Sprintf("Error saving listing: %v", err), http.StatusInternalServerError)
		return
	}

	// Parse the JSON back for response
	var factsMap map[string]interface{}
	json.Unmarshal(factsJSON, &factsMap)

	response := CreateListingResponse{
		ID:              listing.ID,
		HostInputFacts:  factsMap,
		AIDescription:   listing.AIDescription,
		CreatedAt:       listing.CreatedAt.Format(time.RFC3339),
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func getListing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid listing ID", http.StatusBadRequest)
		return
	}

	var listing Listing
	if err := db.First(&listing, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Listing not found", http.StatusNotFound)
			return
		}
		http.Error(w, fmt.Sprintf("Error fetching listing: %v", err), http.StatusInternalServerError)
		return
	}

	// Parse the JSON facts
	var factsMap map[string]interface{}
	json.Unmarshal([]byte(listing.HostInputFacts), &factsMap)

	response := CreateListingResponse{
		ID:              listing.ID,
		HostInputFacts:  factsMap,
		AIDescription:   listing.AIDescription,
		CreatedAt:       listing.CreatedAt.Format(time.RFC3339),
	}

	json.NewEncoder(w).Encode(response)
}


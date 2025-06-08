package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Request struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Company string `json:"company"`
}

const BASE_URL = "https://amused-mallard-typically.ngrok-free.app"
const LOCAL_BASE_URL = "http://localhost:8080"
const CONTENT_TYPE = "application/json"

func send() {
	request := &Request{
		Name:    "John Doe",
		Email:   "John@test.com",
		Company: "Test",
	}
	if byteData, err := json.Marshal(request); err == nil {
		response, err := http.Post(BASE_URL+"/api/submit", CONTENT_TYPE, bytes.NewBuffer(byteData))
		if err != nil {

		} else {

		}
		defer response.Body.Close()

		body, err := io.ReadAll(response.Body)
		if err != nil {
			fmt.Println("Error reading response:", err) 
		} else {
			fmt.Println("Response Body:", string(body))
		}
	}
}

func main() {
	send()
}

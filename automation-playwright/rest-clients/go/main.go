package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const BASE_URL = "https://amused-mallard-typically.ngrok-free.app"
const LOCAL_BASE_URL = "http://localhost:8080"
const CONTENT_TYPE = "application/json"

func send() {
	form := url.Values{}
	form.Add("Name", "john_doe")
	form.Add("Business Email", "john@mail.com")
	form.Add("Company name", "Testing")
	form.Add("g-recaptcha-response", "")
	response, err := http.PostForm(BASE_URL+"/api/leads", form)
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
	} else {
		fmt.Println("Response Body:", string(body))
	}
}

func main() {
	send()
}

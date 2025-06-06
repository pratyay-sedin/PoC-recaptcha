package main

import (
	"app_be/configuration"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
)

func verifyRecaptcha(token string) bool {
	conf := &configuration.Config{}
	conf.LoadConfig()
	resp, err := http.PostForm(conf.RecaptcaptchaVerificationURL,
		url.Values{
			"secret":   {conf.SecretKey},
			"response": {token},
		})
	if err != nil {
		fmt.Println("HTTP error verifying reCAPTCHA:", err.Error())
		return false
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if bodyBytes, err := io.ReadAll(resp.Body); err == nil {
		if err := json.Unmarshal(bodyBytes, &result); err != nil {
			fmt.Println("Error decoding JSON: ", err)
		}
	} else {
		fmt.Printf("Error reading response body: %s", err.Error())
	}
	println("reCAPTCHA response JSON:")
	for k, v := range result {
		fmt.Println(k, "=", v)
	}

	success, ok := result["success"].(bool)
	if !ok || !success {
		fmt.Println("reCAPTCHA verification failed:", result)
		return false
	}
	return true
}

func handleFormSubmission(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Could not parse form", http.StatusBadRequest)
		return
	}
	recaptchaToken := r.FormValue("g-recaptcha-response")
	if !verifyRecaptcha(recaptchaToken) {
		http.Error(w, "reCAPTCHA failed", http.StatusForbidden)
		return
	}
	w.Write([]byte("Verified!"))
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Form received"))
}

func main() {
	config := &configuration.Config{}
	config.LoadConfig()
	http.HandleFunc("/api/submit", handleFormSubmission)
	port := strconv.Itoa(int(config.ServerPort))
	http.ListenAndServe(":"+port, nil)
}

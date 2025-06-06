package main

import (
	"app_be/configuration"
	"app_be/util"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
)

func verifyRecaptcha(token string) bool {
	conf := &configuration.Config{}
	conf.LoadConfig()

	fmt.Println(conf.SecretKey)
	fmt.Println(token)
	resp, err := http.PostForm(conf.RecaptcaptchaVerificationURL,
		url.Values{
			"secret":   {conf.SecretKey},
			"response": {token},
		})
	if err != nil {
		println("HTTP error verifying reCAPTCHA:", err.Error())
		return false
	}
	util.LogCaptchaResponse(resp)
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		println("Error decoding JSON:", err.Error())
		return false
	}
	println("reCAPTCHA response JSON:")
	for k, v := range result {
		println(k, "=", v)
	}

	success, ok := result["success"].(bool)
	if !ok || !success {
		println("reCAPTCHA verification failed:", result)
		return false
	}
	return true
}

func handleFormSubmission(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
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

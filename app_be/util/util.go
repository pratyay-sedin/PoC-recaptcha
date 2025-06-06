package util

import (
	"encoding/json"
	"fmt"
	"net/http"
)


type CaptchaResponse struct {
	Success     bool     `json:"success"`
	Score       float64  `json:"score,omitempty"`
	Action      string   `json:"action,omitempty"`
	ChallengeTS string   `json:"challenge_ts,omitempty"`
	Hostname    string   `json:"hostname,omitempty"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
}

func LogCaptchaResponse(response *http.Response) {
	var result CaptchaResponse
	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		fmt.Println("Error decoding JSON:", err)
	}
	fmt.Printf("Recaptcha verification result: %+v\n", result)
}
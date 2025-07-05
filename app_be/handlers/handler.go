package handlers

import (
	"app_be/configuration"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

func verifyRecaptcha(token string, conf *configuration.Config) bool {
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
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return false
	}

	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return false
	}

	fmt.Println("reCAPTCHA response JSON:")
	for k, v := range result {
		fmt.Println(k, "=", v)
	}

	success, ok := result["success"].(bool)
	if !ok || !success {
		fmt.Println("reCAPTCHA verification failed:", result)
		return false
	}

	score := result["score"]
	if score == "0.9" || score == "1.0" {
		fmt.Println("reCAPTCHA verification failed:", result)
	}

	return true
}

func HandleFormSubmission(conf *configuration.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c = setHeaders(c)
		if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Could not parse form"})
			return
		}
		recaptchaToken := c.PostForm("g-recaptcha-response")
		if !verifyRecaptcha(recaptchaToken, conf) {
			c.JSON(http.StatusForbidden, gin.H{"error": "reCAPTCHA failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Verified! Form received"})
	}
}

func HandleLogin() gin.HandlerFunc {
	return func(c *gin.Content) {
		c = setHeaders(c)
	}
}

func setHeaders(c *gin.Context) *gin.Context {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	return c
}

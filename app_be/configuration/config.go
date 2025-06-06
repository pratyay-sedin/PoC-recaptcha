package configuration

import (
	"os"
	"strconv"
	"github.com/joho/godotenv"
	"fmt"
)

type Config struct {
	ServerPort                   uint
	SecretKey                    string
	RecaptcaptchaVerificationURL string
}

func (c *Config) LoadConfig() *Config {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	if port, err := strconv.Atoi(os.Getenv("SERVER_PORT")); err == nil {
		c.ServerPort = uint(port)
	} else {
		fmt.Println("Invalid port, check .env file")
	}
	c.SecretKey = os.Getenv("SECRET_KEY")
	c.RecaptcaptchaVerificationURL = os.Getenv("RECAPTCHA_VERIFICATION_URL")
	return c
}
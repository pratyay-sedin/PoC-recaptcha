package configuration

import "testing"

func TestLoadConfig(t *testing.T) {
	config := &Config{}
	config.LoadConfig()
	if config.SecretKey == "" {
		t.Error("could not load the server key, check your .env file ")
	}
	if config.RecaptcaptchaVerificationURL == "" {
		t.Error("could not load the captcha verfication url, check your .env file")
	}
	if config.ServerPort == 0 {
		t.Error("could not load the captcha verifcation url, check your .env file")
	}
}
package util

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func LogCaptchaResponse(response *http.Response) {
	var result map[string]interface{}
	if bodyBytes, err := io.ReadAll(response.Body); err == nil {
		if err := json.Unmarshal(bodyBytes, &result); err != nil {
			fmt.Println("Error decoding JSON: ", err)
		}
		fmt.Printf("decoded response: %+v\n", result)
	} else {
		fmt.Printf("Error reading response body: %s", err.Error())
	}
}

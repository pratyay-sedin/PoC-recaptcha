package main

import (
	"app_be/configuration"
	"net/http"
	"app_be/handlers"
	"github.com/gin-gonic/gin"
	"strconv"
)


func main() {
	conf := &configuration.Config{}
	conf.LoadConfig()
	r := gin.Default()

	r.OPTIONS("/api/submit", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Status(http.StatusOK)
	})
	r.POST("/api/submit", handlers.HandleFormSubmission(conf))
	r.POST("/api/login", handlers.HandleLogin())
	port := strconv.Itoa(int(conf.ServerPort))
	r.Run(":" + port)
}

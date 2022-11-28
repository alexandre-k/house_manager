package main

import (
	"io/ioutil"
	"encoding/json"
	"path/filepath"
	"math/big"
	"fmt"
	"net/http"
	"os"
	"time"
	"github.com/gin-gonic/gin"
	supa "github.com/nedpals/supabase-go"
)


type Receipt struct {
	Id int `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Amount int `json:"amount"`
	date big.Int `json:"date"`
	category string `json:"category"`
	hash string `json:"hash"`
	publicKey string `json:"public_key"`
	ownershipProof string `json:"ownership_proof"`
	imageName string `json:"image_name"`
	imageDataUrl string `json:"image_data_url"`
	imageType string `json:"image_type"`
}

var supabaseUrl = os.Getenv("SUPABASE_URL")
var supabaseKey = os.Getenv("SUPABASE_API_KEY")
var supabase = supa.CreateClient(supabaseUrl, supabaseKey)


func GetReceipts(context *gin.Context) {
	// var receipts []Receipt
	var receipts []map[string]interface{}
	var err = supabase.DB.From("receipts").Select("*").Gte("date", context.Query("minDate")).Lte("date", context.Query("maxDate")).Execute(&receipts)
	if err != nil {
		panic(err)
	}

	context.JSON(http.StatusOK, gin.H{"data": receipts})
}

func CreateReceipt(context *gin.Context) {
	data, _ := ioutil.ReadAll(context.Request.Body)
	var jsonData map[string]interface{}
	if e := json.Unmarshal(data, &jsonData); e != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": e.Error()})
		return
	}
	var result interface{}
	var err = supabase.DB.From("receipts").Insert(&jsonData).Execute(&result)
	fmt.Println(err)
	// if err != nil {
	// context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	// return
	// }
	context.JSON(http.StatusCreated, gin.H{"message": "ok"})
}

// func UpdateReceipt(context *gin.Context) {
// 	data, _ := ioutil.ReadAll(context.Request.Body)
// 	var jsonData bson.M
// 	if e := json.Unmarshal(data, &jsonData); e != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": e.Error()})
// 		return
// 	}
// 	var err = supabase.DB.From("receipts").Update(&receipt).Execute()
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
// 		return
// 	}
// 	context.JSON(http.StatusCreated, gin.H{"message": "ok"})
// }


func UploadImage(context *gin.Context) {
	image, _ := context.FormFile("image")
	date, _ := context.GetPostForm("date")

	dst := filepath.Join("static", date + "_" + filepath.Base(image.Filename))

	context.SaveUploadedFile(image, dst)
	context.String(http.StatusCreated, fmt.Sprintf("'%s uploaded!", image.Filename))

}

func main() {
	router := gin.Default()

	// settings for UploadImage
	router.MaxMultipartMemory = 15 << 20 // 15 MiB max size for pictures
	router.Static("/public", "./public")

	router.GET("/health", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{"ok": true })
	})

	router.GET("/api/receipts", GetReceipts)
	router.POST("/api/receipts", CreateReceipt)
	router.POST("/api/upload", UploadImage)
	router.Run(":3001")
}

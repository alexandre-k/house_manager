package main

import (
	// "io/ioutil"
	// "encoding/json"
	"path/filepath"
	"math/big"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
	supa "github.com/nedpals/supabase-go"
)


type User struct {
	Id int `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	PublicKey string `json:"publicKey"`
	GroupKeys string `json:"groupKeys"`
}

type Receipt struct {
	Id int `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	Amount big.Int `json:"amount"`
	date big.Int `json:"date"`
	category string `json:"category"`
	hash string `json:"hash"`
	userGroup int`json:"userGroup"`
	ownershipProof string `json:"ownershipProof"`
	imageName string `json:"imageName"`
	imageDataUrl string `json:"imageDataUrl"`
	imageType string `json:"imageType"`
}

type NewReceipt struct {
	Amount big.Int `json:"amount"`
	Date big.Int `json:"date"`
	Category string `json:"category"`
	Hash string `json:"hash"`
	PublicKey string `json:"publicKey,omitempty"`
	ImageName string `json:"imageName"`
	ImageType string `json:"imageType"`
	UserGroup int`json:"userGroup,omitempty"`
}

var supabaseUrl = os.Getenv("SUPABASE_URL")
var supabaseKey = os.Getenv("SUPABASE_API_KEY")
var supabase = supa.CreateClient(supabaseUrl, supabaseKey)


func GetReceipts(context *gin.Context) {
	// var receipts []Receipt
	var receipts []map[string]interface{}
	var err = supabase.DB.From("receipts_with_groups").Select("*").Gte("date", context.Query("minDate")).Lte("date", context.Query("maxDate")).Like("groupKeys", "%" + context.Query("publicKey") + "%").Execute(&receipts)
	fmt.Println("receipts ", receipts)
	fmt.Println("GetReceipts error: ", err)
	if err != nil {
		panic(err)
	}

	context.JSON(http.StatusOK, gin.H{"data": receipts})
}

func CreateReceipt(context *gin.Context) {
	// data, _ := ioutil.ReadAll(context.Request.Body)
	var jsonData NewReceipt
	if e := context.ShouldBindJSON(&jsonData); e != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": e.Error()})
		return
	}
	fmt.Println("CreateReceipt: ", jsonData)
	receiptOwner := jsonData.PublicKey

	var foundUsers []User
	var userErr = supabase.DB.From("users").Select("*").Eq("publicKey", receiptOwner).Execute(&foundUsers)
	fmt.Println(userErr)

	if (len(foundUsers) == 0) {
		newUser := map[string]interface{}{ "publicKey": receiptOwner, "groupKeys": receiptOwner}
		var newUserResult []map[string]interface{}
		var insertErr = supabase.DB.From("users").Insert(newUser).Execute(&newUserResult)

		supabase.DB.From("users").Select("*").Eq("publicKey", receiptOwner).Execute(&foundUsers)
		fmt.Println(insertErr)
	}

	var foundUser = foundUsers[0]

	var result interface{}
	jsonData.PublicKey = ""
	jsonData.UserGroup = foundUser.Id
	var receiptErr = supabase.DB.From("receipts").Insert(&jsonData).Execute(&result)
	fmt.Println(receiptErr)
	fmt.Println("Created: ", result)
	// if err != nil {
	// context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	// return
	// }
	context.JSON(http.StatusCreated, gin.H{"message": "ok"})
}

func Share(context *gin.Context) {
	ownerPublicKey := context.Query("ownerPublicKey")
	friendPublicKey := context.Query("friendPublicKey")

	var found User
	supabase.DB.From("users").Select("publicKey").Eq("publicKey", ownerPublicKey).Execute(&found)
	if !strings.Contains(found.GroupKeys, friendPublicKey) {
		found.GroupKeys = found.GroupKeys + "," + friendPublicKey
		var result User
		var updateErr = supabase.DB.From("users").Update(found).Eq("publicKey", ownerPublicKey).Execute(&result)
		fmt.Println("Update error: ", updateErr)
		fmt.Println("Resulting User: ", result)
		context.JSON(http.StatusCreated, gin.H{"message": "Shared."})
	}
	context.JSON(http.StatusOK, gin.H{"message": "Already shared."})

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
	name, _ := context.FormFile("name")
	date, _ := context.GetPostForm("date")

	dst := filepath.Join("public", date + "_" + filepath.Base(name))

	context.SaveUploadedFile(image, dst)
	context.String(http.StatusCreated, fmt.Sprintf("'%s uploaded!", name))

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
	router.POST("/api/share", Share)
	router.Run(":3001")
}

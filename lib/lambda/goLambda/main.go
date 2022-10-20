package main

import (
        "fmt"
        "os"
        "context"
        "strconv"
        "encoding/json"
        "github.com/aws/aws-sdk-go/aws"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-lambda-go/events"
        "github.com/aws/aws-sdk-go/aws/session"
        "github.com/aws/aws-sdk-go/service/dynamodb"
        "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
        "github.com/google/uuid"
)

type Item struct {
        Pk string`json:"pk"`
        Sk string`json:"sk"`
        Email string`json:"email"`
        EmailVerified bool`json:"emailVerified"`
        UserName string`json:"userName"`
}

func HandleRequest(ctx context.Context, event events.CognitoEventUserPoolsPreSignup) (events.CognitoEventUserPoolsPreSignup, error) {
        event2B, _ := json.Marshal(event)
        fmt.Println(string(event2B))
        tableName := os.Getenv("TABLE_NAME")
        fmt.Println(tableName)

        // Create Session
        sess, err := session.NewSession(&aws.Config{
                Region: aws.String("eu-west-1")},
        )

        if err != nil {
                fmt.Println("Error open new session:")
                fmt.Println(err.Error())
                os.Exit(1)
        }

        emailVerified, err := strconv.ParseBool(event.Request.UserAttributes["email_verified"])

        if err != nil {
                emailVerified = false
        }

        item := Item{
                Pk: "user",
                Sk: uuid.New().String(),
                Email: event.Request.UserAttributes["email"],
                EmailVerified: emailVerified,
                UserName: event.UserName,
        }

        item2B, _ := json.Marshal(event)
        fmt.Println(string(item2B))
        
        // Marshall
        av, err := dynamodbattribute.MarshalMap(item)

        if err != nil {
                fmt.Println("Got error marshalling map:")
                fmt.Println(err.Error())
                os.Exit(1)
        }

        // Create DynamoDB client
        svc := dynamodb.New(sess)

        // Create Item
        input := &dynamodb.PutItemInput{
                Item: av,
                TableName: aws.String(tableName),
        }

        _, err = svc.PutItem(input)

        if err != nil {
                fmt.Println("Got error calling PutItem:")
                fmt.Println(err.Error())
                os.Exit(1)
        }

        fmt.Println("Successfully added item to table")
	return event, nil
}

func main() {
        lambda.Start(HandleRequest)
}
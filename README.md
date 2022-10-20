# cdkFirstProject
First test with cdk aws

This PoC uses some of the serverless services such as
- lambda
- dynamodb
- sqs
- sns
- apigateway
- cognito
- appsync

## Installation
```cdk bootstrap```
Bootstrapping deploy the AWS CDK requires dedicated Amazon S3 buckets and other containers to be available to AWS CloudFormation during deployment.
```npm run install```
```npm run lambdaBuild```
To build the go lambda, i'v need of a better solution
```cdk deploy```
To deploy the stack
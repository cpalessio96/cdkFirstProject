import { Construct } from "constructs";
import * as ApiGW from 'aws-cdk-lib/aws-apigateway';
import { Role } from "aws-cdk-lib/aws-iam";

export class DynamoDBIntegration extends Construct {
  dynamodbIntegration: ApiGW.Integration;

  constructor(scope: Construct, id: string, tableName: string, integrationRole: Role) {
    super(scope, id);

    this.dynamodbIntegration = new ApiGW.AwsIntegration({
      service: "dynamodb",
      action: "PutItem",
      options: {
        credentialsRole: integrationRole,
        passthroughBehavior: ApiGW.PassthroughBehavior.WHEN_NO_TEMPLATES,
        requestTemplates: {
          "application/json": JSON.stringify({
              TableName: tableName,
              Item: {
                pk: {'S': "orders"},
                sk: {'S': "$util.autoId()"},
                quantity: {'N': "$input.path('$.quantity')"}
              }
            })
        },
        integrationResponses: [
          {
            statusCode: '200',
          },
          {
            statusCode: '400',
          },
          {
            statusCode: '500',
          }
        ]
      }
    });
  }
}
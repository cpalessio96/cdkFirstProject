import { Construct } from "constructs";
import * as ApiGW from "aws-cdk-lib/aws-apigateway";
import { Role } from "aws-cdk-lib/aws-iam";

export class SqsIntegration extends Construct {
  sendMessageIntegration: ApiGW.Integration;

  constructor(scope: Construct, id: string, queueName: string, integrationRole: Role) {
    super(scope, id);

    this.sendMessageIntegration = new ApiGW.AwsIntegration({
      service: 'sqs',
      path: `${process.env.CDK_DEFAULT_ACCOUNT}/${queueName}`,
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole: integrationRole,
        requestParameters: {
          'integration.request.header.Content-Type': `'application/x-www-form-urlencoded'`,
        },
        requestTemplates: {
          'application/json': 'Action=SendMessage&MessageBody=$input.body',
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
      },
    });
  }
}
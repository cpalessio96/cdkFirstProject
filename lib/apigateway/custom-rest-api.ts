import { Construct } from "constructs";
import * as ApiGW from "aws-cdk-lib/aws-apigateway";

export class CustomRestApi extends Construct {
  api: ApiGW.RestApi;
  constructor(scope: Construct, id: string, sendMessageIntegration: ApiGW.Integration, dynamodbIntegration: ApiGW.Integration, getLambdaIntegration: ApiGW.Integration) {
    super(scope, id);

    this.api = new ApiGW.RestApi(this, id, {});

    const queueResource = this.api.root.addResource('queue');
    const helloResource = this.api.root.addResource('hello');
    const dbResource = this.api.root.addResource("order");

    queueResource.addMethod('POST', sendMessageIntegration, {
      methodResponses: [
        {
          statusCode: '400',
        },
        { 
          statusCode: '200',
        },
        {
          statusCode: '500',
        }
      ]
    });

    dbResource.addMethod('POST', dynamodbIntegration, {
      methodResponses: [
        {
          statusCode: '400',
        },
        { 
          statusCode: '200',
        },
        {
          statusCode: '500',
        }
      ]
    });

    helloResource.addMethod('POST', getLambdaIntegration, {
      methodResponses: [
        {
          statusCode: '400',
        },
        { 
          statusCode: '200',
        },
        {
          statusCode: '500',
        }
      ],
      apiKeyRequired: true,
    });
  }
}
import { Construct } from "constructs";
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as IAM from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { Topic } from "aws-cdk-lib/aws-sns";

export class StreamLambda extends Construct {
  constructor(scope: Construct, id: string, cdkTable: Table, ordersTopic: Topic) {
    super(scope, id);
    const dynamodbEvent = new DynamoEventSource(cdkTable, {
      startingPosition: lambda.StartingPosition.LATEST,
      filters: [
        lambda.FilterCriteria.filter({
          eventName: lambda.FilterRule.isEqual('INSERT'),
          dynamodb: {
            NewImage: {
              product: {
                BOOL: lambda.FilterRule.isEqual("true"),
              },
            },
          },
        }),
      ]
    });
    const lambdaStreamRole = new IAM.Role(this, id, {
      assumedBy: new IAM.ServicePrincipal('lambda.amazonaws.com'),
    });
  
    ordersTopic.grantPublish(lambdaStreamRole);

    const lambdaStream = new lambda.Function(this, 'lambdaStream', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdapyStream')),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.lambda_handler',
      role: lambdaStreamRole,
      environment: {
        TOPIC: ordersTopic.topicArn
      },
    });

    lambdaStream.addEventSource(dynamodbEvent);
  }
}
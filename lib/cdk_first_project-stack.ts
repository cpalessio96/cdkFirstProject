
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ApiGW from 'aws-cdk-lib/aws-apigateway';
import { HelloWorld } from './lambda/hello-world';
import { CdkTable } from './dynamodb/cdk-table';
import { CdkUserPool } from './cognito/cdk-userpool';
import { AppsyncApi } from './appsync/appsync-api';
import { StreamLambda } from './lambda/stream-lambda';
import { OrdersTopic } from './sns/orders-topic';
import { DynamoDBIntegration } from './apigateway/dynamodb-integration';
import { SqsIntegration } from './apigateway/sqs-integration';
import { CustomRestApi } from './apigateway/custom-rest-api';


export class CdkFirstProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { cdkTable } = new CdkTable(this, "cdk-table");

    const { userPool } = new CdkUserPool(this, "cdkuserpool", cdkTable);

    new AppsyncApi(this, "cdk-poc", userPool, cdkTable);

    const { ordersTopic } = new OrdersTopic(this, 'ordersTopic');

    new StreamLambda(this, "lambda-stream-role", cdkTable, ordersTopic);
  
    const { helloFunction } = new HelloWorld(this, 'hello-world');

    const queue = new sqs.Queue(this, 'queue', {
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    });

    // role
    const integrationRole = new IAM.Role(this, 'integration-role', {
      assumedBy: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
    });

    queue.grantSendMessages(integrationRole);
    cdkTable.grantWriteData(integrationRole);


    const { dynamodbIntegration } = new DynamoDBIntegration(this, "db-integration", cdkTable.tableName, integrationRole);
    const { sendMessageIntegration } = new SqsIntegration(this, 'sqs-integration', queue.queueName, integrationRole);
    const getLambdaIntegration = new ApiGW.LambdaIntegration(helloFunction);

    const { api } = new CustomRestApi(this, "rest-api", sendMessageIntegration, dynamodbIntegration, getLambdaIntegration)
    const apiStage = {
      stage: api.deploymentStage,
    };

    const plan = api.addUsagePlan('UsagePlan', {
      name: 'Easy',
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      },
      quota: {
        limit: 100,
        period: ApiGW.Period.DAY
      },
      apiStages: [apiStage],
    });
    
    const key = api.addApiKey('ApiKey');
    plan.addApiKey(key);
  }
  
}
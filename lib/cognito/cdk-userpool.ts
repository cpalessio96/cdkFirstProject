import { Construct } from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import * as IAM from 'aws-cdk-lib/aws-iam';

export class CdkUserPool extends Construct {
  userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, cdkTable: Table) {
    super(scope, id);

    const lambdaRole = new IAM.Role(this, 'lambda-role', {
      assumedBy: new IAM.ServicePrincipal('lambda.amazonaws.com'),
    });

    cdkTable.grantWriteData(lambdaRole);

    const preSignUpFn = new lambda.Function(this, 'preSignUp', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/goLambda')),
      runtime: lambda.Runtime.GO_1_X,
      handler: 'main',
      environment: {
        TABLE_NAME: cdkTable.tableName
      },
      role: lambdaRole
    });

    const clientAttributes = (new cognito.ClientAttributes())
      .withStandardAttributes({fullname: true, email: true})


    this.userPool = new cognito.UserPool(this, id, {
      userPoolName: 'cdk-userpool',
      autoVerify: { email: true, phone: true },
      email: cognito.UserPoolEmail.withSES({
        fromEmail: 'alessio.catania@ctmobi.it',
        fromName: 'CDK App',
        replyTo: 'alessio.catania@ctmobi.it',
        sesRegion: "eu-west-1"
      }),
      lambdaTriggers:{
        preSignUp: preSignUpFn
      }
    });
    this.userPool.addClient("cdkuserpool-client", { readAttributes: clientAttributes, writeAttributes: clientAttributes })
  }
}
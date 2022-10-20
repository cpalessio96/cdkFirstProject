import { Construct } from "constructs";
import { CfnParameter } from 'aws-cdk-lib';
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { AppsyncResolvers } from "./appsync-resolvers";

export class AppsyncApi extends Construct {
  
  constructor(scope: Construct, id: string, userPool: UserPool, cdkTable: Table) {
    super(scope, id);
    const appsyncApi = new appsync.GraphqlApi(this, id, {
      name: 'cdk-poc',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
      xrayEnabled: true,
    });
    
    const datasource = appsyncApi.addDynamoDbDataSource('demoDataSource', cdkTable);
    new AppsyncResolvers(this, "appsync-resolvers", datasource);
};
}
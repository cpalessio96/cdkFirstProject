import { DynamoDbDataSource } from "@aws-cdk/aws-appsync-alpha";
import { Construct } from "constructs";
import * as appsync from '@aws-cdk/aws-appsync-alpha';

export class AppsyncResolvers extends Construct {
  constructor(scope: Construct, id: string, datasource: DynamoDbDataSource) {
    super(scope, id);

    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addContact',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/addContact/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/addContact/response.vtl'),
    });
    
    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'listContacts',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/listContacts/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/listContacts/response.vtl'),
    });

    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'getContact',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/getContact/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('graphql/contact/getContact/response.vtl'),
    });
  }
}
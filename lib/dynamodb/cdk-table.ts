import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkTable extends Construct {
  cdkTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.cdkTable = new dynamodb.Table(this, id, {
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });
  }
}
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
  
export class HelloWorld extends Construct {
  helloFunction: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.helloFunction = new NodejsFunction(this, 'function');
  }
}
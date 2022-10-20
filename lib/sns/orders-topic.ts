import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as snsSubscriptions from "aws-cdk-lib/aws-sns-subscriptions";

export class OrdersTopic extends Construct {
  ordersTopic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.ordersTopic = new sns.Topic(this, id);
    this.ordersTopic.addSubscription( new snsSubscriptions.EmailSubscription("alessio.catania@ctmobi.it"))
  }
}
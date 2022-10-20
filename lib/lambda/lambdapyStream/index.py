import boto3
import os
from botocore.exceptions import ClientError

sns = boto3.client('sns')


def lambda_handler(event, context):

    topic = os.environ['TOPIC']
    try:
        response = sns.publish(
            TopicArn=topic,
            Subject="test",
            Message="prova ciao a tutti"
        )

        message_id = response["MessageId"]
        print(message_id)

    except ClientError as error:
        print(error.response["Error"]["Code"])
        print(error.response["Error"]["Message"])
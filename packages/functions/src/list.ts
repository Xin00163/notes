import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    // 'KeyConditionExpression' defines the condition for the query 'userId = :userId': only return items with matching 'userId' patrition key
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
    },
  };
  const result = await dynamoDb.send(new QueryCommand(params));

  // Return the matching list of items in reponse body
  return JSON.stringify(result.Items);
});



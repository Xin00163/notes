import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@notes/core/util"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data = {
    content: "",
    attachment: "",
  }

  if(event.body != null) {
    data = JSON.parse(event.body)
  }

  const params = {
    TableName: Resource.Notes.name,
    Item: {
      //The attributes of the item to be created
      userId: "123", // the id of the author
      noteId: uuid.v1(), //A unique id
      content: data.content, //Parsed from request body
      attachment: data.attachment, //Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  }

  await dynamoDb.send(new PutCommand(params)); 

  return JSON.stringify(params.Item)
})

// This code doesn’t work just yet but it shows you what we want to accomplish:

// We want to make our Lambda function async, and simply return the results.
// We want to centrally handle any errors in our Lambda functions.
// Finally, since all of our Lambda functions will be handling API endpoints, we want to handle our HTTP responses in one place.

// export async function main(event: APIGatewayProxyEvent) {
//   let data, params;

//   //Request body is passed as a JSON encoded string in "event.body";
//   if (event.body) {
//     // Parse the input from the event.body. This represents the HTTP request body.
//     data = JSON.parse(event.body);
//     params = {
//       TableName: Resource.Notes.name,
//       Item: {
//         //The attributes of the item to be created
//         userId: "123", // the id of the author
//         noteId: uuid.v1(), //A unique id
//         content: data.content, //Parsed from request body
//         attachment: data.attachment, //Parsed from request body
//         createdAt: Date.now(), // Current Unix timestamp
//       },
//     };
//   } else {
//     return {
//       statusCode: 404,
//       body: JSON.stringify({ error: true }),
//     };
//   }


// try {
//   await dynamoDb.send(new PutCommand(params));

//   return {
//     statusCode: 200,
//     body: JSON.stringify(params.Item),
//   }
// } catch (error) {
//   let message;
//   if (error instanceof Error) {
//     message = error.message;
//   } else {
//     message = String(error)
//   }
//   return {
//     statusCode: 500,
//     body: JSON.stringify({error: message})
//   }
// }
// }
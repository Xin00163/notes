import { table } from "./storage";

// Create the API
// We are creating an API using SST’s Api component. It creates an Amazon API Gateway HTTP API.
export const api = new sst.aws.ApiGatewayV2("Api", {
  // By using the transform prop we are telling the API that we want the given props to be applied to all the routes in our API.
  transform: {
    route: {
      handler: {
        // We are linking our DynamoDB table to our API using the link prop. This will allow our API to access our table.
        link: [table],
      },
      args: {
        auth: { iam: true },
      },
    },
  },
});

// The first route we are adding to our API is the POST /notes route. It’ll be used to create a note.
api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("GET /notes", "packages/functions/src/list.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

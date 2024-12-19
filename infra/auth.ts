import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

// The CognitoUserPool component creates a Cognito User Pool for us. We are using the usernames prop to state that we want our users to login with their email.

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  usernames: ["email"],
});

// We are using addClient to create a client for our User Pool. You create one for each “client” that’ll connect to it. Since we only have a frontend we only need one. You can later add another if you add a mobile app for example.
export const userPoolClient = userPool.addClient("UserPoolClient");

// The CognitoIdentityPool component creates an Identity Pool. The attachPermissionsForAuthUsers function allows us to specify the resources our authenticated users have access to.
// We want them to access our S3 bucket and API. Both of which we are importing from api.ts and storage.ts respectively. We’ll look at this in detail below.
export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        // We are also creating a specific IAM policy to secure the files our users will upload to our S3 bucket.
        actions: ["s3: *"],
        resources: [
          // cognito-identity.amazonaws.com:sub is the authenticated user’s federated identity id (their user id). So a user has access to only their folder within the bucket.
          $concat(
            bucket.arn,
            "/private/${cognito-identity.amazonaws.com:sub}/*"
          ),
        ],
      },
      {
        // We are creating an IAM policy to allow our authenticated users to access our API. You can learn more about IAM here.
        actions: ["execute-api:*"],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});

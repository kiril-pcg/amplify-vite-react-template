import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, generateHaikuFunction, MODEL_ID } from './data/resource';
import { Effect, PolicyStatement, ManagedPolicy } from "aws-cdk-lib/aws-iam"

export const backend = defineBackend({
  auth,
  data,
  generateHaikuFunction,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
      `arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
    ],
  })
);

const lambdaRole = backend.generateHaikuFunction.resources.lambda.role;
if (lambdaRole) {
  lambdaRole.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
  );
} else {
  console.error("Lambda role is undefined. Ensure the Lambda resource is correctly configured.");
}
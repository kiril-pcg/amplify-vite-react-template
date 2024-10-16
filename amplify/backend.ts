import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, generateHaikuFunction, MODEL_ID } from './data/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"

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
      `arn:aws:bedrock:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:model/${MODEL_ID}`
    ],
  })
);

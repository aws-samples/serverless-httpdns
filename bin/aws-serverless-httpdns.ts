#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsServerlessHttpdnsRegionalStack } from '../lib/aws-serverless-httpdns-regional-stack';


const regions = ['us-east-1', 'ap-southeast-1', 'ap-northeast-1']
for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    console.log('=====================' + region)

    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'httpdns-serverless-stack-' + region, {
        env: { region: region },
        // crossRegionReferences: true
    })

    new AwsServerlessHttpdnsRegionalStack(stack, 'ServerlessHttpdnsStack-' + region)
}


// const app1 = new cdk.App()
// const stack1 = new cdk.Stack(app1, 'httpdns-serverless-stack-us-east-1', { env: { region: 'us-east-1' }, crossRegionReferences: true })
// new AwsServerlessHttpdnsRegionalStack(stack1, 'us-east-1-httpdns')

// const app2 = new cdk.App()
// const stack2 = new cdk.Stack(app2, 'httpdns-serverless-stack-ap-southeast-1', { env: { region: 'ap-southeast-1' }, crossRegionReferences: true })
// new AwsServerlessHttpdnsRegionalStack(stack2, 'ap-southeast-1-httpdns')


// const app3 = new cdk.App()
// const stack3 = new cdk.Stack(app3, 'httpdns-serverless-stack-us-east-1', { env: { region: 'ap-northeast-1' }, crossRegionReferences: true })
// new AwsServerlessHttpdnsRegionalStack(stack3, 'ap-northeast-1-httpdns')
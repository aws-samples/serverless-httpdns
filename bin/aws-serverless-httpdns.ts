#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsServerlessHttpdnsStack } from '../lib/aws-serverless-httpdns-stack';


const app = new cdk.App();
new AwsServerlessHttpdnsStack(app, 'AwsServerlessHttpdns')
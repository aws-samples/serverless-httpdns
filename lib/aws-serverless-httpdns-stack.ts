import * as cdk from 'aws-cdk-lib';
import { Accelerator } from 'aws-cdk-lib/aws-globalaccelerator';
import { ApplicationLoadBalancerEndpoint } from 'aws-cdk-lib/aws-globalaccelerator-endpoints';
import { Construct } from 'constructs';
import { AwsServerlessHttpdnsRegionalStack } from './aws-serverless-httpdns-regional-stack';

export class AwsServerlessHttpdnsStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const regionalStack = new AwsServerlessHttpdnsRegionalStack(this, 'AwsServerlessHttpdnsStack')

        const accelerator = new Accelerator(this, 'Accelerator')
        const listener = accelerator.addListener('Listener', { portRanges: [{ fromPort: 80 }] });
        listener.addEndpointGroup('endpoint-1', { endpoints: [new ApplicationLoadBalancerEndpoint(regionalStack.alb)] })

        new cdk.CfnOutput(this, 'GA DNS name', { value: accelerator.dnsName })
        new cdk.CfnOutput(this, 'GA ARN', { value: accelerator.acceleratorArn })
    }
}

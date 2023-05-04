import * as cdk from 'aws-cdk-lib';
import { IpAddresses, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LambdaTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class AwsServerlessHttpdnsRegionalStack extends cdk.Stack {

    alb: ApplicationLoadBalancer

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const lambda = new DockerImageFunction(this, 'httpdns-lamdba-function', {
            description: 'httpdns core function', code: DockerImageCode.fromImageAsset(path.join(__dirname, '../src')),
        })
        new cdk.CfnOutput(this, 'Lambda Function', { value: lambda.functionName })

        const vpc = new Vpc(this, 'httpdns-hosting-vpc', {
            ipAddresses: IpAddresses.cidr('100.64.0.0/24'),
            maxAzs: 3,
            subnetConfiguration: [{ name: 'public-ingress', cidrMask: 28, subnetType: SubnetType.PUBLIC }]
        })
        new cdk.CfnOutput(this, 'Hosting VPC ARN', { value: vpc.vpcArn })


        const alb = new ApplicationLoadBalancer(this, 'httpdns-ingress-alb', { vpc: vpc, internetFacing: true })
        const listener = alb.addListener("Listener", { port: 80 })
        listener.addTargets('Targets', { targets: [new LambdaTarget(lambda)] })
        new cdk.CfnOutput(this, 'ALB DNS', { value: alb.loadBalancerDnsName })


        this.alb = alb;
    }
}

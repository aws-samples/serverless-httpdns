// import * as cdk from 'aws-cdk-lib';
// import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
// import { Accelerator } from 'aws-cdk-lib/aws-globalaccelerator';
// import { ApplicationLoadBalancerEndpoint } from 'aws-cdk-lib/aws-globalaccelerator-endpoints';
// import { Construct } from 'constructs';
// import { AwsServerlessHttpdnsRegionalStack } from './aws-serverless-httpdns-regional-stack';

// interface endpointAlb {
//     region: string,
//     alb: ApplicationLoadBalancer
// }

// export class AwsServerlessHttpdnsStack extends cdk.Stack {

//     constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//         super(scope, id, props);

//         const regions = ['us-east-1', 'ap-southeast-1', 'ap-northeast-1']
//         const endpointAlbs: endpointAlb[] = []
//         regions.every((val) => {
//             const httpdnsStack = new AwsServerlessHttpdnsRegionalStack(
//                 this, 'AwsServerlessHttpdnsStack', { env: { region: val } }
//             );
//             endpointAlbs.push({ region: val, alb: httpdnsStack.alb })
//         })

//         const accelerator = new Accelerator(this, 'Accelerator')
//         const listener = accelerator.addListener('Listener', { portRanges: [{ fromPort: 80 }] });
//         endpointAlbs.every((val) => {
//             listener.addEndpointGroup(val.region, { endpoints: [new ApplicationLoadBalancerEndpoint(val.alb)] })
//         })
//         new cdk.CfnOutput(this, 'GA DNS name', { value: accelerator.dnsName })
//         new cdk.CfnOutput(this, 'GA ARN', { value: accelerator.acceleratorArn })
//     }
// }

##  How to build a httpdns resolver on aws

This solution is built on a Serverless architecture, using AGA+ALB+Lambda to implement an httpDNS system. The fully Serverless architecture eliminates the need for operations and maintenance costs. Lambda is a managed service that supports multi-Availability Zone deployment and comes with built-in high availability features. The solution can be quickly deployed with AWS CDK.


* To achieve global access with low latency and high performance, this solution uses AWS Global Accelerator to provide access to the nearest edge location. By leveraging the performance, security, and availability of AWS's global infrastructure, users can access the system through an anycast IP static address, without relying on DNS.
* Global Accelerator allows each listener to bind to different endpoint groups in various regions. Depending on the user's location, Global Accelerator sends requests to the nearest target in the AWS region. Global Accelerator also provides endpoint health checks and prevents requests from being sent to unhealthy targets.
* ALB+Lambda provides an httpProxy that uses the X-Forwarded-For (XFF) header to determine the client's real IP address and apply a geolocation-based DNS resolution strategy.
* Lambda is a highly available service that supports multi-Availability Zone deployment. Deploying Lambda functions across multiple regions provides even greater reliability and reduces global user access latency.
* Lambda itself is a highly available service that supports multi-Availability Zone deployment. Deploying Lambda functions across multiple regions provides even greater reliability and reduces global user access latency.
* This solution also supports IPv4 and IPv6 dual-stack resolution.

### Build
* Make sure you follow the [AWS CDK Prerequisites][1] before you build the project.
* Clone this project and change the directory to the root folder of the project, and run below commands:
```
$ npm install -g aws-cdk
$ npm install  
$ cdk bootstrap —region ${AWS_REGION_CODE} aws://${YOUR_ACCOUNT_ID}/${AWS_REGION_CODE}
```

### Deploy
Run commands as below:
```
$ cdk synth
$ cdk deploy --all
```

### Verify
```
curl -XPOST http://${GA_STATIC_IP_ADDRESS} \
-H 'Content-Type: application/json' \
-d '{"recordName":"www.amazon.com","recordType":"A"}'

"d3ag4hukkh62yn.cloudfront.net. 60 IN A 143.204.81.223"%
```

### Clean
Run commands as below:
```
$ cdk destroy
```

### Takeaway
HTTPDNS can be used as a backup for normal UDP DNS resolution failure in client/APP, ensuring correct resolution results in the event of LocalDNS hijacking, and improving the availability of the client system. Deploying HTTPDNS based on Lambda takes advantage of Lambda's features to achieve high availability while reducing deployment complexity. In addition, Serverless is billed on a usage basis, which means no cost is incurred if no queries are made, and multiple-region deployment of Lambda can provide near-zero-cost HA disaster recovery.

  [1]: https://docs.aws.amazon.com/cdk/latest/guide/work-with.html#work-with-prerequisites

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
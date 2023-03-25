# How to deploy infrastructure for CI/CD in Gitlab for aou-backend

## Prerequisites

1. AWS account 
2. Amazon EKS cluster already deployed due to https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html (for a separate environment: dev, staging, prod)
3. ECR repositories for images for deploying environment (aou-backend-deploy) and for aou-backend components (for a separate environment: dev, staging, prod)
4. Special user with programmatic access responsible for deploying (deploy bot), this user should have the following policies: 
 - Policy to access to EKS (`AmazonEKSAdminPolicy`):
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "eks:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:PassedToService": "eks.amazonaws.com"
                }
            }
        }
    ]
}
```
 - Policy to read and to write to ECR (`AmazonECRReadWritePolicy`, `<region-name>`, `<AWS-accound-id>` and `<repo-template>` below should be changed to their real values):
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListImagesInRepository",
            "Effect": "Allow",
            "Action": [
                "ecr:ListImages"
            ],
            "Resource": "arn:aws:ecr:<region-name>:<AWS-accound-id>:repository/<repo-template>"
        },
        {
            "Sid": "GetAuthorizationToken",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ManageRepositoryContents",
            "Effect": "Allow",
            "Action": [
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetRepositoryPolicy",
                "ecr:DescribeRepositories",
                "ecr:ListImages",
                "ecr:DescribeImages",
                "ecr:BatchGetImage",
                "ecr:BatchDeleteImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "arn:aws:ecr:<region-name>:<AWS-accound-id>:repository/<repo-template>"
        }
    ]
}
```
5. aws-iam-authenticator (https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
6. AWS CLI 2 configured for necessary region and with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for a user having necessary permissions
7. Kubectl
8. Helm 3

## Deploying infrastructure in AWS EKS cluster

1. Deploy image for deploying environment and push it to AWS ECR:
```
./build-deploy-env-image.sh <ecrURL> [<deployEnvRepoName>]
```
(see details in build-deploy-env-image.sh)
2. Update kubeconfig for AWS EKS cluster:
```
aws eks update-kubeconfig --name=<cluster-name>
```
3. [Optional] Install Kubernetes Dashboard (https://github.com/kubernetes/dashboard) 
```
./install-kubernetes-dashboard.sh
```
(after this execute `kubectl proxy` and use a token obtainer as follows: https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md#getting-a-bearer-token)
4. Install Gitlab Runner:
```
./install-gitlab-runner.sh <runnerRegistrationToken> [<tags>]
```
(see details in install-gitlab-runner.sh)

## Configuration of Gitlab

1. Create necessary environments (development, staging, production) (see https://docs.gitlab.com/ee/ci/environments/)
2. Add AWS EKS cluster to Gitlab (see https://docs.gitlab.com/ee/user/project/clusters/add_existing_cluster.html)
3. Create the following variables in Gitlab CI/CD Settings (https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project):
 - AWS_ACCESS_KEY_ID for deploy bot (see above Prerequisites, item 4)
 - AWS_SECRET_ACCESS_KEY for deploy bot
 - AWS_SSL_CERT_ARN with AWS ARN for SSL cerificate for given domain
 - AWS_DEFAULT_REGION
 - DEPLOY_ENV_IMAGE_TAG given as <ecrURL>/<deployEnvRepoName>:latest (see build-deploy-env-image.sh)
 - ECR_REPOSITORY given as <ecrURL>/<repoForBackendImages>
 - ENV_DEFAULT_BRANCH with name of default branch for given environment
 - EXTERNAL_URL_RANDOM_HASH with some random hash included into URL of external endpoint for safety reasons
4. [Optional] Restrict Gitlab Runner to a given environment in Gitlab CI/CD Settings, section Runners
5. Make the user mentioned in the item 4 of Prerequisites belong to the group `system-masters` (see https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html,
section "To add an IAM user or role to an Amazon EKS cluster"), for example, it is possible to execute
```
kubectl edit -n kube-system configmap/aws-auth
```
and manually fill the corresponding item in `mapUsers` by `userarn` taken from [AWS IAM](https://console.aws.amazon.com/iam/home)

6. Follow the instructions given at https://www.padok.fr/en/blog/external-dns-route53-eks taking into account https://artifacthub.io/packages/helm/bitnami/external-dns, so that
it is necessary to modify respective commands given by the first link as follows:
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install external-dns bitnami/external-dns \
--set provider=aws \
--set domainFilters[0]=launchpad-saas.net \
--set policy=sync \
--set registry=txt \
--set txtOwnerId=<HOSTED_ZONE_ID> \
--set interval=3m \
--set rbac.create=true \
--set serviceAccount.name=external-dns \
--set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn"="<ROLE_ARN>"
```
Here `<HOSTED_ZONE_ID>` is taken from https://console.aws.amazon.com/route53/home#hosted-zones: while `<ROLE_ARN>` is taken from the role created due to https://www.padok.fr/en/blog/external-dns-route53-eks

7. Follow the instruction given at https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/ to install Load Balancer Controller in AWS EKS cluster
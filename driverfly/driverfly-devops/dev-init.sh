##
## This script only needs to be run one time. It will create the driverfly-data S3 bucket in localstack
##

aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket driverfly-data --acl public-read

const {
  STORAGE_PROVIDER,
  FOLDER,
  AWS_S3_API_VERSION,
  AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} = process.env;

export const providerConfig = {
  name: STORAGE_PROVIDER || 'LOCAL',
  localBucketConfig: {
    location: FOLDER,
  },
  s3BucketConfig: {
    aws_s3_apiVersion: AWS_S3_API_VERSION || '',
    aws_s3_bucketName: AWS_S3_BUCKET_NAME || '',
    aws_accessKeyId: AWS_ACCESS_KEY_ID || '',
    aws_secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
    aws_region: AWS_REGION || '',
  },
  gcpBucketConfig: {},
};

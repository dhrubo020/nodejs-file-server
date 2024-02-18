const { STORAGE_PROVIDER, FOLDER } = process.env;

export const providerConfig = {
  name: STORAGE_PROVIDER || 'LOCAL',
  localBucketConfig: {
    location: FOLDER,
  },
  s3BucketConfig: {},
  gcpBucketConfig: {},
};

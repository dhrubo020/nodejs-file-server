const { FILE_VALIDITY_IN_DAYS, CORN_RUN_AT } = process.env;
export const schedulerConfig = {
  fileValidityInDays: parseInt(FILE_VALIDITY_IN_DAYS) || 3,
  cronRunAt: CORN_RUN_AT,
};

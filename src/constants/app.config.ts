
  export const AppConfig = {
    DEFAULT_MESSAGE_ERROR: "Something went wrong",
    SALT_ROUND: 12,
    LOGIN_STEP: {
      VERIFY_OTP_CODE: 1,
      ADD_INFO: 2,
      ADD_WALLET: 3,
      ACTIVE: 4,
    },
    EMAIL_SUBJECT: {
      VERIFY_ACCOUNT: "Verify your account",
      FORGOT_PASSWORD: "Reset password",
    },
    FILE_IMAGE_UPLOAD: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'],
    MAX_FILE_IMAGE_UPLOAD: 3145728, //3 * 1024 * 1024,
    LIMIT: 10,
    OFFSET: 0,
    STATIC_DIR: 'src/assets',
    MAX_FILE_UPLOAD: 104857600, //100 * 1024 * 1024,
    NFT_ERC_721_QUANTITY: 1,
    DEFAULT_SORT_FIELD: 'createdAt',
    SORT_DESC: -1,
    SORT_ASC: 1,
    MINIMUM_INCREMENT_PERCENT: 5,
    MAXIMUM_INCREMENT_PERCENT: 100,
    EXPIRED_DAY: 3,
  
  }
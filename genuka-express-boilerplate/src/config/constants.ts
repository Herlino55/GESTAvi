export const OAUTH = {
  TOKEN_ENDPOINT: "/oauth/token",
  REFRESH_ENDPOINT: "/oauth/refresh",
  GRANT_TYPE: "authorization_code",
  TIMESTAMP_TOLERANCE_MS: 5 * 60 * 1000, // 5 minutes
} as const;

export const DB_DEFAULTS = {
  CONNECTION_LIMIT: 5,
  TIMEOUT: 10000,
} as const;

export const WEBHOOK_EVENTS = {
  // Company events
  COMPANY_UPDATED: "company.updated",
  COMPANY_DELETED: "company.deleted",

  // Order events
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",

  // Product events
  PRODUCT_CREATED: "product.created",
  PRODUCT_UPDATED: "product.updated",

  // Subscription events
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_UPDATED: "subscription.updated",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",

  // Payment events
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type WebhookEventType =
  (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

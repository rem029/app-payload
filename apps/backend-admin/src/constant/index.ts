export const WEB_TYPE = process.env.WEB_TYPE || "default";
export const FRONTEND_URL =
  process.env.PAYLOAD_PUBLIC_FRONTEND_URL || "http://localhost:3000";
export const ENV = process.env.NODE_ENV || "development";
export const MAX_FILE_SIZE = process.env.PAYLOAD_PUBLIC_MAX_FILE_SIZE || 5000000;

export const NODE_MAILER_USER = process.env.PAYLOAD_PUBLIC_NODE_MAILER_USER;
export const NODE_MAILER_PASS = process.env.PAYLOAD_PUBLIC_NODE_MAILER_PASS;
export const NODE_MAILER_FROM = process.env.PAYLOAD_PUBLIC_NODE_MAILER_FROM;
export const NODE_MAILER_HOST = process.env.PAYLOAD_PUBLIC_NODE_MAILER_HOST;
export const NODE_MAILER_PORT = process.env.PAYLOAD_PUBLIC_NODE_MAILER_PORT;
// export const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
// export const OPEN_AI_ASSISTANT_KEY = process.env.OPEN_AI_ASSISTANT_KEY;

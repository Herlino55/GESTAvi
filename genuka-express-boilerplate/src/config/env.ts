import 'dotenv/config';

export const env = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:4000',

  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'genuka_express',
  },

  // Genuka OAuth
  genuka: {
    url: process.env.GENUKA_URL,
    clientId: process.env.GENUKA_CLIENT_ID || '',
    clientSecret: process.env.GENUKA_CLIENT_SECRET || '',
    redirectUri: process.env.GENUKA_REDIRECT_URI
  },
} as const;

export function validateEnv(): void {
  const required = [
    'DATABASE_URL',
    'GENUKA_CLIENT_ID',
    'GENUKA_CLIENT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('   Please check your .env file');
  }
}

export default env;

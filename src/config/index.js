import { config } from 'dotenv';
process.env.DOTENV_PATH ? config({ path: process.env.DOTENV_PATH }) : config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } = process.env;
export const PORT = process.env.PORT;
export const dbUri = process.env.DB_CONNECTION_URI;
export const mongo_db_uri = process.env.MONGO_DB_URI as string;
export const admin_email = process.env.ADMIN_EMAIL as string;
export const admin_username = process.env.ADMIN_USERNAME;
export const admin_password = process.env.ADMIN_PASSWORD as string;
export const jwt_secret = process.env.JWT_SECRET as string;
export const jwt_exp = process.env.JWT_EXP as string;
export const admin_jwt_secret = process.env.ADMIN_JWT_SECRET as string;
export const redis_host = process.env.REDIS_HOST as string;
export const redis_port = process.env.REDIS_PORT as any;

export const cloud_name = process.env.CLOUD_NAME;
export const api_key = process.env.API_KEY;
export const api_secret = process.env.API_SECRET;

console.log("apikey", api_key);

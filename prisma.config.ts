import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
    migrations: {
        seed: 'ts-node prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL
    },
});

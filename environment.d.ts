declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      DATABASE_PASSWORD: string;
      PORT: number;
      NODE_ENV: string;
    }
  }
}

export {};

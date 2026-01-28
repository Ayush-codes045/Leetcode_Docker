// import redis,{createClient} from "redis";
//   const client = createClient({ url: process.env.REDIS_URL });
//   if(!client.isOpen){
//     client.connect();
//   }
//   client.on("error", (err) => {
//     console.log("Redis error: ", err);
//   });
//     client.on("connect", () => {
//     console.log("Redis connected");
//   });
// export default client;
import { createClient } from "redis";

let client: ReturnType<typeof createClient>;

// Check if Redis URL is configured
if (process.env.REDIS_URL && process.env.REDIS_URL.trim() !== "") {
  client = createClient({ url: process.env.REDIS_URL });
  
  if (!client.isOpen) {
    client.connect().catch((err) => {
      console.error("Failed to connect to Redis:", err);
    });
  }

  client.on("error", (err) => {
    console.log("Redis error:", err);
  });

  client.on("connect", () => {
    console.log("Redis connected successfully");
  });
} else {
  console.warn("⚠️  Redis URL not configured. Using mock client.");
  
  // Mock client for when Redis is not available
  client = {
    isOpen: false,
    LPUSH: async (...args: any[]) => {
      console.log("Mock Redis LPUSH called:", args);
      return 0;
    },
    connect: async () => {},
    disconnect: async () => {},
    on: () => {},
  } as any;
}

export default client;
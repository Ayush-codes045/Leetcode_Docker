import redis,{createClient} from "redis";
  const client = createClient({ url: process.env.REDIS_URL });
  if(!client.isOpen){
    client.connect();
  }
  client.on("error", (err) => {
    console.log("Redis error: ", err);
  });
    client.on("connect", () => {
    console.log("Redis connected");
  });
export default client;

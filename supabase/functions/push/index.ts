console.log("Hello from Functions!");

import { serve, Response } from "https://deno.land/std/http/server.ts";
import { fetch } from "https://deno.land/std/http/mod.ts";
import "https://deno.land/x/dotenv/load.ts"; // Load environment variables from .env file

const pushNotificationsKeyID = Deno.env.get("PUSH_NOTIFICATIONS_KEY_ID");
const expoPushToken = "ExponentPushToken[Xic7KeMAbGxq_AhgJ8VJV_]";

if (!pushNotificationsKeyID) {
  throw new Error(
    "Push Notifications Key ID is not set in environment variables"
  );
}

const server = serve({ port: 8000 });

console.log("Server is running on port 8000");

for await (const req of server) {
  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pushNotificationsKeyID}`,
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: "default",
        body: "Hello World",
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send push notification: ${res.statusText}`);
    }

    const data = await res.json();

    req.respond({
      status: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error occurred while processing request:", error);
    req.respond({ status: 500, body: "Internal Server Error" });
  }
}

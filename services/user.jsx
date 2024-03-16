import { supabase } from "./supabase";

export async function getRandomUser() {
  const response = await supabase
    .from("profiles")
    .select("*")
    .eq("type", "business")
    .neq(
      "bannerImage",
      "https://ivxipgaauikqwyguqagw.supabase.co/storage/v1/object/public/profile-images/noProfileAVI.jpeg"
    );

  const users = response.data;

  // Fisher-Yates shuffle algorithm to randomize the array
  for (let i = users.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [users[i], users[j]] = [users[j], users[i]];
  }

  // Limit to the first 10 users (or adjust the limit as needed)
  const randomUsers = users.slice(0, 10);

  return randomUsers;
}

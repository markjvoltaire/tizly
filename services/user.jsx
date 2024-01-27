import { supabase } from "./supabase";

export async function getFriends() {
  const userId = supabase.auth.currentUser.id;
  const { body: friends1 } = await supabase
    .from("friendRequests")
    .select("receiverId, senderId")
    .eq("status", "friends")
    .eq("receiverId", userId);

  const { body: friends2 } = await supabase
    .from("friendRequests")
    .select("receiverId, senderId")
    .eq("status", "friends")
    .eq("senderId", userId);

  const postList = friends1.concat(friends2);

  const filteredValues = postList
    .map((item) => {
      const filteredItem = {};
      for (const key in item) {
        if (item[key] !== userId) {
          filteredItem[key] = item[key];
        }
      }
      return filteredItem;
    })
    .map((obj) => Object.values(obj)[0]);

  return filteredValues;
}

export async function getUnlockedUserPost(friendList) {
  const userId = supabase.auth.currentUser.id;
  const resp = await supabase
    .from("post")
    .select("*")
    .in("user_id", [friendList, userId])
    .order("date", { ascending: false });

  return resp.body;
}

export async function getUser(post) {
  const resp = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", post.user_id)
    .single()
    .limit(1);

  return resp;
}

export async function getPosts(userid) {
  let { data: post, error } = await supabase
    .from("post")
    .select("*")
    .eq("user_id", userid)
    .order("id", { ascending: false });

  return post;
}

export async function getFriendStatus(userDetails) {
  const userId = supabase.auth.currentUser.id;
  const userSentRequest = await supabase
    .from("friendRequests")
    .select("status")
    .eq("senderId", userId)
    .eq("receiverId", route.params.post.user_id);

  const userReceivedRequest = await supabase
    .from("friendRequests")
    .select("status")
    .eq("senderId", route.params.post.user_id)
    .eq("receiverId", userId);

  if (userSentRequest.body.length === 1) {
    if (userSentRequest.body[0].status === "friends") {
      return "friends";
    } else if (userSentRequest.body[0].status === "pending") {
      return "pending";
    }
  }

  if (userReceivedRequest.body.length === 1) {
    if (userReceivedRequest.body[0].status === "friends") {
      return "friends";
    } else if (userReceivedRequest.body[0].status === "pending") {
      return "awaitingResponse";
    }
  }

  if (
    userReceivedRequest.body.length === 0 &&
    userSentRequest.body.length === 0
  ) {
    return "notFriends";
  }
}

export async function getRandomUser() {
  const response = await supabase
    .from("profiles")
    .select("*")
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

export async function uploadStatus(description) {
  console.log("description", description);
  const userId = supabase.auth.currentUser.id;
  try {
    const newStatus = {
      user_id: userId,
      description: description, // Use the current value of the description state
      media: null,
      mediaType: "status",
    };
    const resp = await supabase.from("post").insert([newStatus]);
    console.log("resp", resp);
    return resp;
  } catch (error) {
    console.error("Error submitting comment:", error);
    throw error;
  }
}

export async function deletePost(post) {
  const userId = supabase.auth.currentUser.id;
  const resp = await supabase
    .from("post")
    .delete()
    .eq("user_id", userId)
    .eq("id", post.id);

  return resp;
}

export async function reportPostById(post) {
  const userId = supabase.auth.currentUser.id;
  const resp = await supabase.from("reports").insert([
    {
      postId: post.id,
      creatorId: post.user_id,
      userId: userId.userId,
      commentId: "THIS IS A POST REPORT",
      comment: "THIS IS A POST REPORT",
    },
  ]);
  return resp;
}

"use server";

import type { UserProfile } from "@/lib/types";
import axios from "axios";

// Simulate a delay for API calls
const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function verifyTask(taskId: string, userProfile: UserProfile) {
  await simulateDelay(2000); // Simulate network delay

  // In a real application, you would:
  // 1. Use userProfile.twitterUsername, userProfile.discordUsername, etc.
  // 2. Make actual API calls to Twitter, Discord, etc., to verify the task.
  // 3. Handle API keys securely (e.g., environment variables).
  // 4. Handle rate limits and errors from external APIs.
  // 5. Update a persistent database with the user's task completion status.

  let success = false;
  let message = "";

  switch (taskId) {
    case "follow-twitter":
      if (userProfile.twitterUsername && userProfile.twitterUsername !== "") {
        success = true;
        message = "Twitter follow verified successfully!";
      } else {
        success = false;
        message =
          "Please provide your Twitter username in your profile to verify.";
      }
      break;
    case "retweet-announcement":
      if (userProfile.twitterUsername && userProfile.twitterUsername !== "") {
        success = true;
        message = "Retweet verified successfully!";
      } else {
        success = false;
        message =
          "Please provide your Twitter username in your profile to verify.";
      }
      break;
    case "join-discord":
      if (userProfile.discordUsername && userProfile.discordUsername !== "") {
        success = true;
        message = "Discord join verified successfully!";
      } else {
        success = false;
        message =
          "Please provide your Discord username in your profile to verify.";
      }
      break;
    case "join-telegram":
      if (userProfile.telegramUsername && userProfile.telegramUsername !== "") {
        success = true;
        message = "Telegram join verified successfully!";
      } else {
        success = false;
        message =
          "Please provide your Telegram username in your profile to verify.";
      }
      break;
    case "like-posts":
      if (userProfile.twitterUsername && userProfile.twitterUsername !== "") {
        success = true;
        message = "Twitter likes verified successfully!";
      } else {
        success = false;
        message =
          "Please provide your Twitter username in your profile to verify.";
      }
      break;
    case "share-story":
      // Instagram API is complex, simulate success if any social username is provided
      if (
        userProfile.twitterUsername ||
        userProfile.telegramUsername ||
        userProfile.discordUsername
      ) {
        success = true;
        message =
          "Instagram share verified successfully! (Requires manual review)";
      } else {
        success = false;
        message =
          "Please ensure your social media profiles are updated for verification.";
      }
      break;
    case "invite-friends":
      // This would require a more complex backend to track referrals
      success = true;
      message = "Friend invitations verified! (Requires manual check)";
      break;
    case "create-content":
      // This would require manual review or AI analysis
      success = true;
      message = "Content creation verified! (Requires manual review)";
      break;
    case "wallet-connect":
      success = false; // Still locked
      message = "This task is currently locked and cannot be verified.";
      break;
    case "nft-holder":
      if (userProfile.ethAddress && userProfile.ethAddress !== "") {
        success = true;
        message = "NFT ownership verified!";
      } else {
        success = false;
        message =
          "Please provide your Ethereum address in your profile to verify.";
      }
      break;
    default:
      success = false;
      message = "Unknown task.";
  }

  return { success, message, taskId };
}

export async function updateProfile(updatedProfile: UserProfile) {
  await simulateDelay(1000);

  try {
    await axios.put(`http://localhost:3000/api/user`, updatedProfile);

    return {
      success: true,
      message: "Profile updated successfully!",
      updatedProfile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

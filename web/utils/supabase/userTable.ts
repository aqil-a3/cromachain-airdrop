import { UserChangePassword, UserProfileDb } from "@/@types/user";
import { supabase } from "./client";
import { mapDbUserToClient } from "@/lib/map-data/mapDbUserToClient";
import * as bcrypt from "bcryptjs";

/** Helper Function for "user" Table in Supabase */
const tableName = "user";

export async function createNewUser(data: UserProfileDb) {
  const { error } = await supabase.from(tableName).insert(data);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteSoftUSer(id: string) {
  const { error } = await supabase
    .from(tableName)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserPasswordById(id: string) {
  const { error } = await supabase
    .from(tableName)
    .update({ password: null })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("email", email);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userDb: UserProfileDb = data[0];

  return userDb;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userDb: UserProfileDb = data[0];
  const user = mapDbUserToClient(userDb);

  return user;
}

export async function getAllActiveUser() {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .is("deleted_at", null);

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const users = data.map((d) => mapDbUserToClient(d));

  return users;
}

export async function isDupplicateUser(formData: UserProfileDb) {
  const { data: duplicates, error } = await supabase
    .from(tableName)
    .select(
      "email, telegram_username, discord_username, twitter_username, eth_address"
    )
    .or(
      `email.eq.${formData.email}, telegram_username.eq.${formData.telegram_username},discord_username.eq.${formData.discord_username}, twitter_username.eq.${formData.twitter_username}, eth_address.eq.${formData.eth_address}`
    );

  if (error) throw error;

  if (duplicates && duplicates.length > 0) {
    const existing = duplicates[0];

    if (existing.email === formData.email) {
      return {
        message: `Email for ${formData.email} already used!`,
        field: "email",
      };
    }
    if (existing.telegram_username === formData.telegram_username) {
      return {
        message: `Telegram username ${formData.telegram_username} already used!`,
        field: "telegramUsername",
      };
    }
    if (existing.discord_username === formData.discord_username) {
      return {
        message: `Discord username ${formData.discord_username} already used!`,
        field: "discordUsername",
      };
    }
    if (existing.twitter_username === formData.twitter_username) {
      return {
        message: `Twitter username ${formData.twitter_username} already used!`,
        field: "twitterUsername",
      };
    }
    if (existing.eth_address === formData.eth_address) {
      return {
        message: `Ethereum address ${formData.eth_address} already used!`,
        field: "ethAddress",
      };
    }
  }

  return null;
}

export async function changeUserPassword(formData: UserChangePassword) {
  const { userId, confirmPassword, newPassword, currentPassword } = formData;

  if (confirmPassword !== newPassword) {
    return {
      message: "Confirm password doesn't match",
      status: 409,
    };
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("password")
    .eq("id", userId);

  if (error || !data || data.length === 0) {
    console.error(error);
    throw new Error("User not found");
  }

  const dbPassword = data[0].password;

  if (dbPassword) {
    const isPasswordCorrect = await bcrypt.compare(
      String(currentPassword),
      dbPassword
    );
    if (!isPasswordCorrect) {
      return {
        message: "Current password is incorrect",
        status: 409,
      };
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await supabase
    .from(tableName)
    .update({ password: hashedPassword })
    .eq("id", userId);

  if (updateError) {
    console.error(updateError);
    throw updateError;
  }

  return {
    message: "Password updated successfully",
    status: 200,
  };
}

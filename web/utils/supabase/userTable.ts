import { UserChangePassword, UserProfileDb } from "@/@types/user";
import { supabase } from "./client";
import { nanoid } from "nanoid";
import { mapDbUserToClient } from "@/lib/map-data/mapDbUserToClient";
import * as bcrypt from "bcryptjs";
import { BasicHttpResponse, DBCodeType, ResponseWithData } from "@/@types/http";
import { getReferralLimitPerDay } from "./sitesettingsTable";

/** Helper Function for "user" Table in Supabase */
const tableName = "user";

export async function createNewUser(payload: UserProfileDb) {
  const { data, error } = await supabase
    .from(tableName)
    .insert(payload)
    .select();

  if (!data || error) {
    console.error(error);
    throw error;
  }

  return data[0] as UserProfileDb;
}

export async function createNewReferralCode(userId: string) {
  const referral_code = `CROMA-${nanoid(12).toUpperCase()}`;
  const { error } = await supabase
    .from(tableName)
    .update({ referral_code })
    .eq("id", userId);

  if (error) {
    console.error(error);
    throw error;
  }

  return referral_code;
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

export async function getUserByEthAddress(
  eth_address: string
): Promise<ResponseWithData<UserProfileDb | null, DBCodeType>> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("eth_address", eth_address)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {
      data: null,
      code: "ERROR_DB",
      message: "There is something wrong when get user info",
      success: false,
    };
  }

  if (!data)
    return {
      data: null,
      code: "NOT_FOUND",
      message: `User with Etherium address ${eth_address} not found. Please register!`,
      success: false,
    };

  const userDb: UserProfileDb = data;

  if (userDb.deleted_at)
    return {
      data: null,
      code: "BANNED_ACCOUNT",
      message: "This account is banned!",
      success: false,
    };

  return {
    data: userDb,
    code: "SUCCESS",
    message: "User found",
    success: true,
  };
}

export async function getUsersByEthAddresses(
  eth_addresses: string[]
): Promise<ResponseWithData<UserProfileDb[], DBCodeType>> {
  if (!eth_addresses || eth_addresses.length === 0) {
    return {
      data: [],
      code: "ERROR_DB",
      message: "Ethereum addresses are required",
      success: false,
    };
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .in("eth_address", eth_addresses);

  if (error) {
    console.error(error);
    return {
      data: [],
      code: "ERROR_DB",
      message: "There is something wrong when fetching user info",
      success: false,
    };
  }

  // data otomatis hanya berisi row yang ketemu, sisanya hilang
  return {
    data: data || [],
    code: "SUCCESS",
    message: `${(data || []).length} user(s) found from ${eth_addresses.length} addresses`,
    success: true,
  };
}

export async function getUserByIdBulks(ids: string[]) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .in("id", ids)
    .is("deleted_at", null);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userDb: UserProfileDb[] = data;
  const user = userDb.map(mapDbUserToClient);

  return user;
}

export async function getUserByDiscordUsername(discordUsername: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("discord_username", discordUsername);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const userDb: UserProfileDb = data[0];
  const user = mapDbUserToClient(userDb);

  return user;
}

export async function getUserByTelegramUsername(telegramUsername: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("telegram_username", telegramUsername);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const userDb: UserProfileDb = data[0];
  const user = mapDbUserToClient(userDb);

  return user;
}

export async function getUserByReferrerCode(referrerCode: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("referral_code", referrerCode);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const userDb: UserProfileDb = data[0];
  const user = mapDbUserToClient(userDb);

  return user;
}

export async function getUsersByReferrerCode(referrerCodes: string[]) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .in("referral_code", referrerCodes);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data as UserProfileDb[];
}

export async function getAllActiveUser() {
  const batchSize = 1000;
  let allData: any[] = [];
  let from = 0;
  let to = batchSize - 1;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .is("deleted_at", null)
      .range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allData = [...allData, ...data];

    if (data.length < batchSize) break;
    from += batchSize;
    to += batchSize;
  }

  const users = allData.map((d) => mapDbUserToClient(d));

  const userWithReferralCode = users.map((user) => {
    const referralCode = user.referralCode;
    const referralCount = users.filter(
      (u) => u.referredBy === referralCode
    ).length;

    return {
      ...user,
      referralCount,
    };
  });

  return userWithReferralCode;
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

export async function isLimittedReferral(
  referralCode: string
): Promise<BasicHttpResponse> {
  const user = await getUserByReferrerCode(referralCode);
  if (!user) {
    return {
      success: false,
      message: "User referral not found",
    };
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const limitPerDay = await getReferralLimitPerDay();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .eq("referred_by", referralCode)
    .gte("created_at", startOfDay.toISOString());

  if (error) {
    console.error(error);
    throw error;
  }

  const currentLimit = Number(count);

  if (currentLimit >= limitPerDay)
    return {
      success: false,
      message: `This referral code has reached its daily limit (${limitPerDay}). You can register without a referral, or try again tomorrow.`,
    };

  return {
    message: "Continue",
    success: true,
  };
}

export async function isHaveReferralCode(userId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("referral_code")
    .eq("id", userId);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const referralCode: string = data[0].referral_code;

  return referralCode;
}

export async function isValidReferralCode(referralCode: string) {
  const { error, data } = await supabase
    .from(tableName)
    .select("id")
    .eq("referral_code", referralCode);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  if (data.length === 0) return "";

  return data[0].id as string;
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

export async function patchUserEmailVerifiedById(userId: string) {
  const { error } = await supabase
    .from(tableName)
    .update({ verified_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error(error);
    throw error;
  }
}

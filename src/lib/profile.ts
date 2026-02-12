import { createClient } from "@/utils/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  streak_count: number;
  last_active_at: string;
}

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function updateStreak(userId: string) {
  const profile = await getProfile(userId);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!profile) {
    // Initial profile creation with 1 streak
    await updateProfile(userId, {
      streak_count: 1,
      last_active_at: now.toISOString(),
    });
    return 1;
  }

  const lastActive = new Date(profile.last_active_at);
  const lastActiveDay = new Date(
    lastActive.getFullYear(),
    lastActive.getMonth(),
    lastActive.getDate()
  );

  const diffDays = (today.getTime() - lastActiveDay.getTime()) / (1000 * 3600 * 24);

  if (diffDays === 1) {
    // Consecutive day, increment streak
    const newStreak = profile.streak_count + 1;
    await updateProfile(userId, {
      streak_count: newStreak,
      last_active_at: now.toISOString(),
    });
    return newStreak;
  } else if (diffDays > 1) {
    // Streak broken, reset to 1
    await updateProfile(userId, {
      streak_count: 1,
      last_active_at: now.toISOString(),
    });
    return 1;
  }

  return profile.streak_count;
}

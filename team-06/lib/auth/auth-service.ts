import { MOCK_PARENT_USER, User } from "@/lib/constants/auth";
import { createClient } from "@/lib/supabase/client";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  redirectTo?: string;
}

export async function authenticateParent(
  identifier: string,
  password: string
): Promise<AuthResult> {
  const trimmedIdentifier = identifier.trim().toLowerCase();

  // Try Supabase Auth if credentials are configured
  try {
    const supabase = createClient();
    
    // Check if identifier is email
    if (trimmedIdentifier.includes("@")) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedIdentifier,
        password: password,
      });

      if (!error && data.user) {
        return {
          success: true,
          user: {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Parent",
            email: data.user.email || trimmedIdentifier,
            username: data.user.user_metadata?.username || trimmedIdentifier.split("@")[0],
            role: "parent",
          },
          redirectTo: "/dashboard",
        };
      }
    }
  } catch (err) {
    // Supabase optional fallback to demo user
    console.warn("Supabase auth fallback active:", err);
  }

  // Fallback demo user check for easy testing
  const isMatch =
    (trimmedIdentifier === MOCK_PARENT_USER.email.toLowerCase() ||
      trimmedIdentifier === MOCK_PARENT_USER.username.toLowerCase()) &&
    password === MOCK_PARENT_USER.passwordHash;

  if (isMatch) {
    const { passwordHash: _, ...userWithoutPassword } = MOCK_PARENT_USER;
    return {
      success: true,
      user: userWithoutPassword,
      redirectTo: "/dashboard",
    };
  }

  return {
    success: false,
    error: "Invalid email/username or password. Please try again.",
  };
}


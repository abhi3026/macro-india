import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionResult {
  success: boolean;
  message: string;
}

/**
 * Subscribe an email to the Buttondown newsletter via the
 * `subscribe-newsletter` edge function.
 */
export const subscribeToNewsletter = async (email: string): Promise<SubscriptionResult> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
      body: { email },
    });

    if (error) {
      const fallback = (data as SubscriptionResult | null)?.message;
      return {
        success: false,
        message: fallback || error.message || "Subscription failed. Please try again.",
      };
    }

    return (data as SubscriptionResult) ?? { success: true, message: "Subscribed!" };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: false, message: "An error occurred. Please try again later." };
  }
};

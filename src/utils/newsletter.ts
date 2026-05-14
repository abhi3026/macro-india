import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionResult {
  success: boolean;
  alreadySubscribed?: boolean;
  message: string;
}

export const subscribeToNewsletter = async (
  emailRaw: string,
): Promise<SubscriptionResult> => {
  const email = (emailRaw ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const { data, error } = await supabase.functions.invoke<SubscriptionResult>(
      "subscribe-newsletter",
      { body: { email } },
    );

    if (data && typeof data.success === "boolean") return data;

    if (error) {
      console.error("Newsletter subscription error:", error);
      return { success: false, message: "Something went wrong. Please try again." };
    }

    return { success: true, message: "We have sent you a mail, please verify." };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
};

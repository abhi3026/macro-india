/**
 * Newsletter subscription utilities using Buttondown API
 */

// Buttondown API key
const BUTTONDOWN_API_KEY = "89bf93c0-5ceb-4421-902a-3ff8baf6d289";

/**
 * Subscribe an email to the newsletter using Buttondown API
 */
export const subscribeToNewsletter = async (email: string) => {
  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to subscribe");
    }

    return {
      success: true,
      message: "Successfully subscribed to the newsletter!",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to subscribe",
    };
  }
};

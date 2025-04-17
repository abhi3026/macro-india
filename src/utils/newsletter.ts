
/**
 * Newsletter subscription utilities using Buttondown API
 */

// Buttondown API key
const BUTTONDOWN_API_KEY = "89bf93c0-5ceb-4421-902a-3ff8baf6d289";

/**
 * Subscribe an email to the newsletter using Buttondown API
 */
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
      },
      body: JSON.stringify({ email_address: email }), // Using email_address as required by the API
    });

    const data = await response.json();

    if (response.status >= 400) {
      // Check for existing subscriber error
      if (data.email_address && Array.isArray(data.email_address) && data.email_address[0].includes("already exists")) {
        return {
          success: true,
          message: "You're already subscribed to our newsletter!",
        };
      }

      // Handle other API errors
      return {
        success: false,
        message: data.detail || "There was an error subscribing you to the newsletter.",
      };
    }

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "There was an error subscribing you to the newsletter. Please try again later.",
    };
  }
};

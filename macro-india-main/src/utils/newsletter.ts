interface NewsletterResponse {
  success: boolean;
  message?: string;
}

export const subscribeToNewsletter = async (email: string): Promise<NewsletterResponse> => {
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Failed to subscribe to newsletter",
    };
  }
}; 
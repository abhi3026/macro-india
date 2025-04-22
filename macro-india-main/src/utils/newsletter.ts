interface SubscribeResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResponse> {
  try {
    // Here you would typically make an API call to your backend service
    // For now, we'll simulate a successful subscription
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again later.",
    };
  }
} 
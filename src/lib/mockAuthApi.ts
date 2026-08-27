const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface RegisterRequest {
  displayName: string;
  email: string;
  password?: string; // Optional since this is mock
  ageConfirmation: boolean;
}

export interface RegisterResponse {
  success: boolean;
  userId?: string;
  error?: string;
}

export const mockAuthApi = {
  async register(req: RegisterRequest): Promise<RegisterResponse> {
    await delay(600); // Simulate network

    if (!req.email || !req.email.includes('@')) {
      return { success: false, error: 'Invalid email address.' };
    }

    if (!req.displayName || req.displayName.length < 2) {
      return { success: false, error: 'Display name is too short.' };
    }

    if (!req.ageConfirmation) {
      return { success: false, error: 'You must confirm permission to register.' };
    }

    // Generate a new mock user ID
    const newUserId = 'FIN' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // MOCK WARNING: In a real app, we would hash the password here and store it in a DB.
    // For now, we just return the generated ID so the frontend can "login" with it immediately.
    
    return {
      success: true,
      userId: newUserId
    };
  }
};

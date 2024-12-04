interface User {
    name: string;
    email: string;
    password: string;
    role: string;
}

export class AuthService {
    private API_URL = 'http://localhost:5000/api';

    async register(name: string, email: string, password: string, role: string) {
        try {
            const response = await fetch(`${this.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                return { success: false, error: data.error };
            }

            return data;
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: 'Login failed' };
        }
    }
} 
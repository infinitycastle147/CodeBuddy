import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        username?: string;
        isVerified?: boolean;
    }
    
    interface Session {
        user: User & {
            id: string;
            username?: string;
            isVerified?: boolean;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        username?: string;
        isVerified?: boolean;
    }
}
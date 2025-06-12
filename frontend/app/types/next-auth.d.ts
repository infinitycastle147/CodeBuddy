import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
    }
    interface Session {
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        username?: string;
        email?: string;
        isVerified?: boolean;
    }
}
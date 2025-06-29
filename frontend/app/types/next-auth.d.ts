import 'next-auth';

declare module 'next-auth' {
   interface User {
       id: string;
       email: string;
       name: string;
       username: string;
       image?: string;
       isVerified: boolean;
       role: string;
   }
   
   interface Session {
       user: User & {
           id: string;
           email: string;
           name: string;
           username: string;
           image?: string;
           isVerified: boolean;
           role: string;
       };
       accessToken?: string;
       provider?: string;
       expires_at?: number;
   }
}

declare module 'next-auth/jwt' {
   interface JWT {
       id: string;
       email: string;
       name: string;
       username: string;
       picture?: string;
       isVerified: boolean;
       role: string;
       accessToken?: string;
       provider?: string;
       expires_at?: number;
   }
}
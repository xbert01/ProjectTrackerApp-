import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      isManager: boolean;
    };
  }

  interface User {
    isManager?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isManager: boolean;
  }
}

function isManager(email: string): boolean {
  const managerEmails = process.env.MANAGER_EMAILS?.split(',').map((e) => e.trim()) || [];
  return managerEmails.includes(email);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id || token.sub || '';
        token.isManager = isManager(user.email || '');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isManager = token.isManager;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

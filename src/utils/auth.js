import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './connect';
import { getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

async function getUser(email) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, //30 minutes
  },
  providers: [
    Credentials({
      type: 'credentials',
      credentials: {
        email: {
          label: 'E-mail',
          type: 'email',
          placeholder: 'test@test.com',
          value: 'test@test.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '123456',
        },
      },
      async authorize(credentials) {
        const { email } = credentials;
        const user = await getUser(email);
        if (!user) {
          console.log("User doesn't exist");
          return null;
        }
        if (email !== user.email || user.accessBlocked) {
          return null;
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);

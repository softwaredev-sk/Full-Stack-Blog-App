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
    // return {
    //   id: '410544b2-4001-4271-9855-fec4b6a6442a',
    //   name: 'User',
    //   email: 'user@nextmail.com',
    //   // password: '$2b$10$rFOjPJ19nxMakfGlkE4.ReLuR0mNl5O/t.9RNglSSTV20TfigLjOi',
    //   password: '123456',
    // };
    // const user = await sql`SELECT * FROM users WHERE email=${email}`;
    // console.log('print user format ', user.rows[0]);
    // return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60,
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
        const { email, password } = credentials;
        const user = await getUser(email);
        if (!user) {
          console.log("User doesn't exist");
          return null;
        }
        if (user.email !== 'test@test.com' || password !== '123456') {
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

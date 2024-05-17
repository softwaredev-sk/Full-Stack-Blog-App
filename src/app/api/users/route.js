import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('user');
  console.log('user -', email);

  const query = {
    where: {
      userEmail: email,
    },
  };
  try {
    const [postCount, commentsCount] = await prisma.$transaction([
      prisma.post.count(query),
      prisma.comment.count(query),
    ]);

    return new NextResponse(
      JSON.stringify({ postCount, commentsCount }, { status: 200 })
    );
  } catch (err) {
    // console.log('comments ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching user data!' },
        { status: 500 }
      )
    );
  }
};

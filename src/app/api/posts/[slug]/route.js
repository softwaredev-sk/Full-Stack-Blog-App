import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    const exists = await prisma.post.findFirst({ where: { slug } });
    if (exists) {
      // console.log('exists?', exists);
      const post = await prisma.post.update({
        where: { slug },
        data: { views: { increment: 1 } },
        include: { user: true },
      });
      // console.log('itspost ', post);
      return new NextResponse(
        JSON.stringify({ post, statusCode: 200 }, { status: 200 })
      );
    }
    return new NextResponse(
      JSON.stringify(
        { message: 'Post not found', statusCode: 404 },
        { status: 404 }
      )
    );
  } catch (err) {
    // console.log('posts slug ', err);
    return new NextResponse(
      JSON.stringify(
        {
          message: `Something went wrong in fetching single post!! ${err.message}`,
        },
        { status: 500 }
      )
    );
  }
};

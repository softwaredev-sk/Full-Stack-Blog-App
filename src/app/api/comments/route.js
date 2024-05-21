import { getAuthSession } from '@/utils/auth';
import prisma from '@/utils/connect';
import { Comme } from 'next/font/google';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get('postSlug');

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
      include: { user: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new NextResponse(JSON.stringify(comments, { status: 200 }));
  } catch (err) {
    // console.log('comments ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching comments!' },
        { status: 500 }
      )
    );
  }
};

export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated!' }, { status: 401 })
    );
  }

  try {
    const data = await req.json();
    const { comment, identifier } = data;
    // console.log('postbody-', body);
    const postedComment = await prisma.comment.create({
      data: {
        desc: comment,
        postSlug: identifier,
        userEmail: session.user.email,
      },
    });

    return new NextResponse(JSON.stringify(postedComment, { status: 200 }));
  } catch (err) {
    // console.log('comments2 ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching comments-2!' },
        { status: 500 }
      )
    );
  }
};

export const PUT = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated!' }, { status: 401 })
    );
  }

  try {
    const data = await req.json();
    const { comment, identifier } = data;
    console.log('body', comment, ' , ', identifier);
    const updatedComment = await prisma.comment.update({
      where: {
        id: identifier,
      },
      data: {
        desc: comment,
        edited: true,
      },
    });

    return new NextResponse(JSON.stringify(updatedComment, { status: 200 }));
  } catch (err) {
    // console.log('updateComment ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching comments-2!' },
        { status: 500 }
      )
    );
  }
};

export const DELETE = async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated!' }, { status: 401 })
    );
  }

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(deletedComment, { status: 200 }));
  } catch (err) {
    // console.log('deleteComment ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching comments-2!' },
        { status: 500 }
      )
    );
  }
};

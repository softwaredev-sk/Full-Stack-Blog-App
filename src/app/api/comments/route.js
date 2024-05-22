import { getAuthSession } from '@/utils/auth';
import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

const COMMENT_PER_PAGE = 5;

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get('postSlug');
  const commentPage = Number(searchParams.get('commentPage')) || 1;

  const query = {
    take: COMMENT_PER_PAGE,
    skip: COMMENT_PER_PAGE * (commentPage - 1),
    orderBy: { createdAt: 'desc' },
    where: {
      ...(postSlug && { postSlug: postSlug }),
    },
    include: { user: true },
  };

  try {
    const exists = await prisma.comment.findFirst({
      where: {
        ...(postSlug && { postSlug: postSlug }),
      },
    });
    let comments, count;
    // if (exists) {
    [comments, count] = await prisma.$transaction([
      prisma.comment.findMany(query),
      prisma.comment.count({ where: query.where }),
    ]);
    // }

    const hasPrev = COMMENT_PER_PAGE * (commentPage - 1) > 0;
    const hasNext =
      COMMENT_PER_PAGE * (commentPage - 1) + COMMENT_PER_PAGE < count;
    const totalPage = Math.ceil(count / COMMENT_PER_PAGE);

    return new NextResponse(
      JSON.stringify({ comments, hasPrev, hasNext, totalPage }, { status: 200 })
    );
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
    // console.log('body', comment, ' , ', identifier);
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
  const postSlug = searchParams.get('postSlug');
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated!' }, { status: 401 })
    );
  }

  try {
    const [deletedComment, count] = await prisma.$transaction([
      prisma.comment.delete({
        where: {
          id: id,
        },
      }),
      prisma.comment.count({
        where: {
          postSlug,
        },
      }),
    ]);

    const totalPageAfterDelete = Math.ceil(count / COMMENT_PER_PAGE);
    // console.log(deletedComment, '++', totalPageAfterDelete);

    return new NextResponse(
      JSON.stringify({ deletedComment, totalPageAfterDelete }, { status: 200 })
    );
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

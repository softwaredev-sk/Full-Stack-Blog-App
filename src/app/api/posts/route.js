import { getAuthSession } from '@/utils/auth';
import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  const cat = searchParams.get('cat');
  const featured = searchParams.get('featured');
  const popular = searchParams.get('popular');

  const POST_PER_PAGE = 4;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    orderBy: { createdAt: 'desc' },
    where: {
      ...(cat && { catSlug: cat }),
    },
  };

  try {
    let posts, count, featuredPost, menuPosts;
    if (!featured && !popular) {
      [posts, count] = await prisma.$transaction([
        prisma.post.findMany(query),
        prisma.post.count({ where: query.where }),
      ]);
      if (page === 1) {
        revalidatePath('/', 'layout');
      }
    }
    if (featured) {
      featuredPost = await prisma.post.findFirst({
        orderBy: { views: 'desc' },
      });
    }

    if (popular === 'true') {
      menuPosts = await prisma.post.findMany({
        orderBy: { views: 'desc' },
        take: 5,
        include: { user: true },
      });
      // console.log('true', menuPosts);
    }

    //popular === false means fetching for editor's pick section, where editorPick is true in post db
    if (popular === 'false') {
      menuPosts = await prisma.post.findMany({
        where: {
          editorPick: true,
        },
        orderBy: { views: 'asc' },
        take: 5,
        include: { user: true },
      });
      // console.log('false', menuPosts);
    }

    const hasPrev = POST_PER_PAGE * (page - 1) > 0;
    const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;
    const totalPage = Math.ceil(count / POST_PER_PAGE);

    return new NextResponse(
      JSON.stringify(
        { posts, hasPrev, hasNext, featuredPost, menuPosts, totalPage },
        { status: 200 }
      )
    );
  } catch (err) {
    // console.log('posts ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching posts!' },
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
    const body = await req.json();
    const data = body.data;
    if (data.title.trim() == '' || data.desc.trim().length < 20) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid Data!' }, { status: 401 })
      );
    }
    const post = await prisma.post.create({
      data: { ...data, userEmail: session.user.email },
    });
    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    // console.log('posts2 ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching post!' },
        { status: 500 }
      )
    );
  }
};

export const PUT = async (req) => {
  const session = await getAuthSession();
  const currentDateTime = new Date();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated!' }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const { data, identifier } = body;
    console.log('data-', data, ' idt-', identifier);

    if (data.title.trim() == '' || data.desc.trim().length < 100) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid Data!' }, { status: 401 })
      );
    }
    const post = await prisma.post.update({
      where: {
        id: identifier,
      },
      data: {
        ...data,
        userEmail: session.user.email,
        edited: true,
        postUpdatedAt: currentDateTime,
      },
    });
    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    // console.log('posts2 ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching post!' },
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
    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(deletedPost, { status: 200 }));
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

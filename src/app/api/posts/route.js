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
    where: {
      ...(cat && { catSlug: cat }),
    },
  };

  try {
    // const posts = await prisma.post.findMany({
    //   take: POST_PER_PAGE,
    //   skip: POST_PER_PAGE * (page - 1),
    // });

    // console.log('thisis', typeof popular);

    let posts, count, featuredPost, popularPosts;
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
      popularPosts = await prisma.post.findMany({
        orderBy: { views: 'desc' },
        take: 5,
        include: { user: true },
      });
    }

    if (popular === 'false') {
      popularPosts = await prisma.post.findMany({
        orderBy: { views: 'asc' },
        take: 5,
        include: { user: true },
      });
    }

    const hasPrev = POST_PER_PAGE * (page - 1) > 0;
    const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

    return new NextResponse(
      JSON.stringify(
        { posts, hasPrev, hasNext, featuredPost, popularPosts },
        { status: 200 }
      )
    );
  } catch (err) {
    console.log('posts ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'posts Something went wrong!' },
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
    if (body.title.trim() == '' || body.desc.trim().length < 20) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid Data!' }, { status: 401 })
      );
    }
    const post = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });
    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log('posts2 ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'posts2 Something went wrong!' },
        { status: 500 }
      )
    );
  }
};

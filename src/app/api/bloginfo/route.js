import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const fieldname = searchParams.get('fieldname');
  try {
    const info = await prisma.bloginfo.findFirst({
      where: {
        fieldname: fieldname,
      },
    });
    // console.log('BLOGINGO FETCH', info);
    return new NextResponse(JSON.stringify(info, { status: 200 }));
  } catch (err) {
    // console.log('bloginfo ', err);
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in fetching blog info!' },
        { status: 500 }
      )
    );
  }
};

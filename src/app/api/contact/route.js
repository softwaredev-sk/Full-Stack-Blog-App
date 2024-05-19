import { getAuthSession } from '@/utils/auth';
import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';

export const POST = async (req) => {
  const session = await getAuthSession();
  let sessionEmail = 'notloggedin@notloggedin.com';

  if (session) {
    sessionEmail = session.user.email;
  }

  try {
    const body = await req.json();
    await prisma.contactme.create({
      data: { ...body, userEmail: sessionEmail },
    });

    return new NextResponse(
      JSON.stringify(
        { message: 'Form submitted successfully' },
        { status: 200 }
      )
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify(
        { message: 'Something went wrong in submitting contact form!' },
        { status: 500 }
      )
    );
  }
};

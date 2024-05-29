import { getAuthSession } from '@/utils/auth';
import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { mailOptions, transporter } from '@/utils/mailerConfig';

function generateHtml(body, sessionEmail) {
  const html = `${
    sessionEmail === 'notloggedin@notloggedin.com'
      ? `<h2>You have got a mail from an unknown user named '${body.name}' with the mail id ${body.email}!</h2>`
      : `<h2>Registered user with the email id ${sessionEmail} sent you a mail as ${body.email}!</h2>`
  } \n
  <p><b>Name:</b>  ${body.name}</p>
  <p><b>Email:</b> ${body.email}</p>
  <p><b>Message:</b> ${body.content}</p>
  `;
  return html;
}

export const POST = async (req) => {
  const session = await getAuthSession();
  let sessionEmail = 'notloggedin@notloggedin.com';

  if (session) {
    sessionEmail = session.user.email;
  }

  try {
    const body = await req.json();
    await transporter.sendMail({
      ...mailOptions,
      subject: `${body.email} says: ${body.subject}`,
      text: body.content,
      html: generateHtml(body, sessionEmail),
    });
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

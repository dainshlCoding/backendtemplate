import nodemailer from 'nodemailer';

export async function sendUnlockUserMail(firstName: string, lastName: string, email: string): Promise<void> {
    const transporter = createMailTransporter();
    const mailOptions = {
        from: process.env.HOSTMAIL,
        to: process.env.MYMAIL,
        subject: 'A new user wants to sign up',
        text: `A new user requested access to your application. Please review and unlock user in DB : ${firstName} ${lastName} - ${email}`
    };
    await transporter.sendMail(mailOptions);
    return;
}

function createMailTransporter() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmx.de',
        port: 587,
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.HOSTMAIL,
            pass: process.env.GMXPW,
        },
    });
    return transporter
}
const nodemailer = require('nodemailer');


exports.sendEmail = async options => {

    console.log(`host: ${process.env.EMAIL_HOST}`);
    console.log(`port: ${process.env.EMAIL_PORT}`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    const mailOptions = {
        from: 'Maximo Brito <info@tripApp.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);
}
// api/send-address.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { address } = req.body;

        // Konfigurasi Nodemailer dengan SMTP Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.dibayangkan111@gmail.com, // Email Gmail kamu
                pass: process.env.google33_1, // Password Gmail kamu atau App Password
            },
        });

        const mailOptions = {
            from: process.env.dibayangkan111@gmail.com, // Dari email
            to: process.env.ramadhan40012@gmail.com,   // Dikirim ke email yang sama
            subject: 'New Address Submitted',
            text: `A new address was submitted: ${address}`,
        };

        try {
            // Mengirim email
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Address sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

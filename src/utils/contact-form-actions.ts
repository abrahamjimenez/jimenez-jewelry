"use server"

import nodemailer from "nodemailer"
import type {Options} from "nodemailer/lib/mailer";
import type {SentMessageInfo} from "nodemailer/lib/smtp-transport";
import {Values} from "@/components/ContactForm";

export async function action({values}: {values: Values}) {
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Nodemailer Send Mail
const mailOptions: Options = {
    from: process.env.MAIL,
    to: process.env.MAIL_TO,
    subject: "Jimenez Jewelry",
    html: `<b>Name: </b> ${values.name}<br/><br/><b>Email: </b> ${values.email}<br/><br/><b>Phone: </b> ${values.phone}<br/><br/><b>Comment: </b> ${values.comment}`
}

await new Promise(() => {
    transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
            console.error("Error sending email: ", error)
        } else {
            console.log("Email sent: ", info.response)
        }
    })
})

}

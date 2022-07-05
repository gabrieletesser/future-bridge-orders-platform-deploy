// import { mail } from "@sendgrid/mail"
import mail from "@sendgrid/mail";

export default async function handler(req, res) {


    mail.setApiKey("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")

    const msg = {
        to: 'gabriele@thecometnetwork.cz', // Change to your recipient
        from: 'info@future-bridge.eu', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    const response = await mail.send(msg);

    res.status(200)
    res.json(
        {
            response_status: response[0].statusCode,
            response_headers: response[0].headers
        }
    )

}
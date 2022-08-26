import { supabase } from "../../utils/supabase";
import mail from "@sendgrid/mail";

export async function post_confirmTransaction(req, res) {

    try {

        mail.setApiKey(process.env.SENDGRID_API_KEY)

        var body = await JSON.parse(req.body);

        console.log(body);

        plan.transactionID = body.TransId;
        let status;
        switch (body.Status) {
        case "2":
            status = "completed";
            break
        case "8":
            status = "failed";
            break
        case "7":
            status = "cancelled";
            break
        }

        var { data: order, error } = await supabase.from('fb_orders').update({ status: status, paid_price: body.Amount }).match({ uid: body.MerchantRef });
        
        console.log('Order updated')
        const msg = {
            to: order[0].email, // Change to your recipient
            from: 'info@future-bridge.eu', // Change to your verified sender
            subject: 'Thank you for purchasing ' + order[0].purchased_package_name,
            text: 'We inform you that the payment is ' + status,
            html: `<h2>Dear Mr./Ms. ${order[0].first_name} ${order[0].last_name}.</h2><br/><strong>We inform you that the payment is ${status}</strong>`,
        }

        await mail.send(msg);
        console.log('First email sent')

        const privateMsg = {
            to: 'info@future-bridge.eu', // Change to your recipient
            from: 'info@future-bridge.eu', // Change to your verified sender
            subject: 'Purchase for ' + order[0].purchased_package_name,
            text: `Mr./Ms. ${order[0].first_name} ${order[0].last_name} ordered ${order[0].purchased_package_name}. Payment status: ${status}`,
            html: `<h2>Dear Mr./Ms. ${order[0].first_name} ${order[0].last_name}.</h2><br/><strong>We inform you that the payment is ${status}</strong>`,
        }

        await mail.send(privateMsg);
        console.log('Private email sent')

        res.status(200)

    } catch (err) {
        console.log('!!!!ERROR:', e.message)
        res.status(500)
        
    }
}
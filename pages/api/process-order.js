import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../utils/supabase";
import { getPaymentUrl } from "../../utils/moneytigo";
import mail from "@sendgrid/mail";

export default async function handler(req, res) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);

  console.log("API KEY", process.env.SENDGRID_API_KEY);
  try {
    const { details, url } = JSON.parse(req.body);
    console.log(JSON.parse(req.body));

    const data = await fetch(
      `https://${url}/wp-json/wp/v2/package/?slug=${details.purchased_package_slug}`
    );

    const [pack] = await data.json();
    console.log(pack);

    let calculated_price =
      Number(pack.discounted_price) * (details.participants.length + 1);

    console.log(calculated_price);
    console.log(Number(details.total) == calculated_price);

    if (Reflect.has(details, "discount_code") && details.discount_code != "") {
      const discount = await fetch(
        `https://${url}/wp-json/wp/v2/discount_code?slug=${details.discount_code}&_fields=discount_percent`
      );
      const _discount = await discount.json();
      const discountAmount = Number(_discount[0].discount_percent);
      calculated_price =
        calculated_price - calculated_price * (discountAmount / 100);
      console.log(details);
    }

    if (Number(details.total) == calculated_price) {
      details.uid = uuidv4();

      const { data: order, error } = await supabase
        .from("fb_orders")
        .insert([details]);

      if (error) {
        res.json(error);
      }

      const msg = {
        to: order[0].email, // Change to your recipient
        from: "info@future-bridge.eu", // Change to your verified sender
        subject: "Thank you for purchasing " + order[0].purchased_package_name,
        text: "We have registered your order. We will send you confirmation of payment as soon as possible",
        html: `<h2>Dear Mr./Ms. ${order[0].first_name} ${order[0].last_name}.</h2><br/><strong>Thank you for your purchase! We have registered your order and we'll confirm the payment as soon as possible</strong>`,
      };

      await mail.send(msg);

      console.log("mail sent");

      const payment = await getPaymentUrl(
        order[0],
        url,
        details.purchased_package_slug
      );

      res.status(200).json(payment);
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: e.message });
  }
}

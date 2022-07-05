import { supabase } from "../../utils/supabase";

export async function post_confirmTransaction(req, res) {

    try {
        var body = await JSON.parse(req.body);

        console.log(body);

        // var plan = await wixData.get('purchased-plans', body.MerchantRef)

        // var { data: plan, error } = await supabase.from('fb_orders').select().eq('uid', body.MerchantRef)

        // plan.paymentStatus = "completed";
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

        var { data: result, error } = await supabase.from('fb_orders').update({ status: status, paid_price: body.Amount }).match({ uid: body.MerchantRef });

        res.status(200)

    } catch (err) {

        res.status(500)
        
    }
}
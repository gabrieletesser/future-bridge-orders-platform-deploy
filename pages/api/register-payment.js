export default function handler(req, res) {
    const { details } = JSON.parse(req.body)
    console.log(details);
    res.status(200).json({ name: 'John Doe' })
    
    //Update order in Supabase

    //Request payment details from MoneyTigo

    //Send email to Customer via SendGrid

    //Update order with further details

}

import axios from "axios"

export const sendOtp = async(phone, otp) => {
    try {
        const response = await axios.post("https://control.msg91.com/api/v5/flow/",
            {
                flow_id: process.env.MSG91_FLOW_ID,
                sender: process.env.MSG91_SENDER_ID,
                mobiles: `91${phone}`,
                otp: otp
            },
            {
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY,
                    "Content-Type": "application/json" 
                }
            }
        )
        
        return response.data;
    } catch (error) {
        console.log(
            error.response?.data || error.message
        );

        throw new Error("Failed to send OTP");
    }
}
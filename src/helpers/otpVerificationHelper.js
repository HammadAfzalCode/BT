const _ = require('lodash');
const nodeMailer = require("nodemailer");
const config = require('../globals/config');
const { PinoLogger, logger } = require('../../logger');

const sendOtpViaEmail = async (userEmail, otp) => {
    try {
        const host = config.get('nodeMailer').host;
        const companyEmail = config.get('nodeMailer').email;
        const password = config.get('nodeMailer').password;

        const transporter = nodeMailer.createTransport({
            host: host,
            auth: {
                user: companyEmail,
                pass: password,
            },
        });

        const info = await transporter.sendMail({
            from: companyEmail,
            to: userEmail,
            subject: "Brake Time Verification Code",
            text: "Brake Time Verification Code",
            html: `<p><h2>Your Verification Code is <b>${otp}</b></h2></p>`,
        });

        logger.info("Message sent: %s", info.messageId);
        logger.info("Message Response: ", info.response);

        return true;
        
    } catch (error) {
        logger.error("Error sending email: ", error);
        return false;
    }
};

module.exports = {
    sendOtpViaEmail,
}
const randomString = require("random-string");
const sgMail = require("@sendgrid/mail");

const verificationString = randomString({ length: 50 });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailer = async (senderEmail) => {
  try {
    const msg = {
      to: senderEmail,
      from: "Invoice App <cannot.reply.to.me@gmail.com>",
      subject: "Set a new password",
      html: `<div style="margin : 0 auto; width: 450px; border:1px solid lightgray; border-radius:5px; padding:1rem; text-align:center;">
        <h1 style="font-size:1rem; color:salmon; text-align: left;"> <lead>Dear user,</lead> <br/> <br/>if you have requested for a new password. Please verify this email to set a new password or simply ignore this email.</h1>
        <div style="padding:1rem; margin:0.75rem auto; width:400px; height: 300px;">
        <a href="https://proj-invoice.netlify.app/update/${verificationString}">
          <img src="https://images.unsplash.com/photo-1590280986931-d675a2cf9b2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1047&q=80" style="width:100%; height:100%; text-decoration:none; cursor: pointer;" alt="recover-password">
        </a>
          </div>
          <em style="font-size:.875rem; color:black; text-align: left;">Note: This link can only be used once. After that it will get expired.</em> <br /> <br />
        <a href="https://proj-invoice.netlify.app/update/${verificationString}" style="font-size: 1rem; padding:0.75rem; border:none; border-radius:5px; text-decoration:none; background-color: rgb(76, 175, 75); color: whitesmoke; cursor:pointer;">Reset Now</a> <br /> <br />
        </div>`,
    };
    await sgMail.send(msg);
    // server errors
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = { emailer, verificationString };

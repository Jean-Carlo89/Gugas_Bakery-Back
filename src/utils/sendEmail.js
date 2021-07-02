import sgMail from "@sendgrid/mail";

sgMail.setApiKey(
  "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"
);
const sendEmail = (to, from, subject, text) => {
  const msg = {
    to,
    from,
    subject,
    html:text,
  };

  sgMail.send(msg, function (err, info) {
    if (err) {
      console.log("email not sent");
    } else {
      console.log("email sent");
    }
  });
};

export default sendEmail;

/*const output = `
<h3>Você fez uma compra na Guga's Bakery no valor de ${req.body.price} reais! </h3>
<h3>O Guga agradece o seu <strong>DINHEIRO</strong>.</h3>
`*/


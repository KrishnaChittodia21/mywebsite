const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const expshbr=require('express-handlebars');
const nodemailer=require('nodemailer');

const app=express();

app.engine('handlebars',expshbr());
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/assets',express.static(path.join(__dirname,'assets')));


app.get('/',(req,res)=>{
  res.render('reachme');
});

app.post('/send',(req,res) => {
  const output=`
  <p>You have a new mail contact</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name:${req.body.name}</li>
    <li>Email:${req.body.email}</li>
    <li>Phone no.:${req.body.phone}</li>
    <li>Subject:${req.body.subject}</li>
    <li>Message:${req.body.message}</li>
  </ul>
  `;

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'kannudoe@gmail.com', // generated ethereal user
            pass: ''  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
    });
    var receivers=req.body.email;
    var subject=req.body.subject;
    var message=req.body.message;
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Krishna 👻" <kannudoe@gmail.com>', // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('reachme',{msg:'Email has been sent please check your mail'});
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});


app.listen(3001,()=> console.log("server is running.."));

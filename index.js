const nodemail = require('nodemailer');
const express = require ('express');
var path = require('path');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use ('/img', express.static(__dirname + '/assets'));

app.get ('/', function (req,res) {
  /** Mandando a pagina html em caso de requisição get para esta rota */
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post ('/', function (req,res) {
  const nameUser = req.body.name;
  const emailUser = req.body.email;
  const subjectUser = req.body.subject;
  const phoneUser = req.body.phone;
  const messageUser = req.body.message;
  const cepUser = req.body.cep;

  dataForm(nameUser, emailUser, subjectUser, phoneUser, messageUser, cepUser);
  res.redirect('/')
})  

app.listen(21092);

/** Função que recebe os dados do req.body e utiliza elas no nodemailer */
function dataForm (nameUser, emailUser, subjectUser, phoneUser, messageUser, cepUser) {

/** Configuração dos dados de SMTP do servidor */
const transporter = nodemail.createTransport({
  host: "smtp.mailtrap.io", /** Teste mailtrap, utilizar servidor smtp real */
  port: 2525,
  secure: false,
  auth: {
    user: process.env.smtp_user,
    pass: process.env.smtp_pass
  }
});

/** Dados recebidos do formulario */
const options = {
    from : process.env.smtp_email, 
    to: emailUser, 
    subject: `Um novo orçamento foi solicitado`,
    html: `<h4> Orçamento: </h4>
    <p><b>Para o usuário:</b> ${nameUser}.</p> 
    <p><b>Email:</b>  ${emailUser} e  <b>Telefone:</b> ${phoneUser}.</p> 
    <p><b>Para o serviço de:</b> ${subjectUser}.</p>
    <p><b>Para o cep:</b> ${cepUser}</p> 
    <p><b>A mensagem digitada foi:</b> ${messageUser}</p>`
    }

transporter.sendMail(options, (error, info) =>{
    if(error) console.log(error)
     else console.log(info) 
})
}


import express from 'express';
import { createTransport } from 'nodemailer';
import { join } from "path";
import { PORT } from "./config.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import smtpTransport from 'nodemailer-smtp-transport';
import cors from "cors";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, './dist')));

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message} = req.body;
    
    // Configura il trasportatore Nodemailer
    const transporter = createTransport(smtpTransport({
        service: 'gmail',
        auth: {
          user: 'luisdevinfo@gmail.com',
          pass: 'ircchghwvydoazhb',
        },
      }));

    // Configura i dettagli dell'email
    const mailOptions = {
      from: `luisdevinfo@gmail.com`,
      to: 'luisdevinfo@gmail.com',
      subject: `Messaggio ricevuto da ${name}`,
      text: `
        Nome: ${name} 
        
        Email: ${email}

        -------------------------------
        Messaggio: ${message}

        -------------------------------
      `,
    };

    // Invia l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email inviata:', info.messageId);

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    res.status(500).json({ success: false, error: 'Errore durante l\'invio dell\'email' });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "./dist", "index.html"));
});

app.listen(PORT, ()=>{
    console.log("server listening on port: " + PORT)
})

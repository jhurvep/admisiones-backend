import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/admisiones", async (req, res) => {
  const { nombre, email, telefono, nivel, mensaje } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admisiones Web" <${process.env.GMAIL_USER}>`,
      to: "ceceoblatasaldivinoamor88095@gmail.com",
      subject: "Nueva solicitud de admisión",
      html: `
        <h2>Nueva solicitud de admisión</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No proporcionado"}</p>
        <p><strong>Nivel:</strong> ${nivel || "No seleccionado"}</p>
        <p><strong>Mensaje:</strong><br>${mensaje || "Sin mensaje"}</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
});

app.listen(3000, () => {
  console.log("Servidor de admisiones activo en puerto 3000");
});


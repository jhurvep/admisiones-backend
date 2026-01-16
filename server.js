// server.js - Backend para formulario de admisiones Oblatas al Divino Amor
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos si los necesitas

// Configuración de Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // ¡USA UNA APP PASSWORD!
  }
});

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Backend de formulario de admisiones - Oblatas al Divino Amor 88095',
    status: 'operativo',
    endpoints: {
      admisiones: 'POST /admisiones',
      salud: 'GET /health'
    }
  });
});

// Ruta de salud para Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ruta para manejar las admisiones
app.post('/admisiones', async (req, res) => {
  const { nombre, email, telefono, nivel, mensaje } = req.body;

  // Validación básica
  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y correo electrónico son requeridos'
    });
  }

  try {
    // Configurar el correo para el administrador
    const mailOptions = {
      from: `"Formulario de Admisiones" <${process.env.GMAIL_USER}>`,
      to: 'ceceoblatasaldivinoamor88095@gmail.com',
      subject: `📚 Nueva solicitud de admisión - ${nombre}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #003366;">¡Nueva solicitud de admisión!</h2>
                    <p><strong>Institución:</strong> CECE Oblatas al Divino Amor 88095</p>
                    <hr style="border: 1px solid #e0e0e0;">
                    
                    <h3 style="color: #1e1e2e;">📋 Información del solicitante:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nombre completo:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Correo electrónico:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Teléfono:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${telefono || 'No proporcionado'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nivel de interés:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${nivel || 'No especificado'}</td>
                        </tr>
                    </table>
                    
                    <h3 style="color: #1e1e2e; margin-top: 20px;">💬 Mensaje adicional:</h3>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #003366;">
                        <p style="margin: 0;">${mensaje || 'Sin mensaje adicional'}</p>
                    </div>
                    
                    <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
                    
                    <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0; color: #2e7d32;">
                            <strong>📅 Fecha de envío:</strong> ${new Date().toLocaleString('es-SV')}
                        </p>
                    </div>
                    
                    <footer style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                        <p>Este mensaje fue enviado automáticamente desde el formulario de admisiones.</p>
                        <p>CECE Oblatas al Divino Amor 88095 · Rosario de Mora, San Salvador</p>
                    </footer>
                </div>
            `
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    console.log(`✅ Solicitud de admisión enviada: ${nombre} (${email})`);

    // Respuesta exitosa al frontend
    res.status(200).json({
      success: true,
      message: '¡Solicitud enviada con éxito!',
      details: 'Hemos recibido tu información y la hemos enviado al equipo de admisiones.'
    });

  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);

    res.status(500).json({
      success: false,
      message: 'Error al enviar la solicitud',
      details: 'Por favor, intenta nuevamente o contacta directamente al +503 7091-1165'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`🌐 URL local: http://localhost:${PORT}`);
});

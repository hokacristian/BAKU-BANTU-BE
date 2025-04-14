const nodemailer = require('nodemailer');

// Create transporter - configure once for reuse
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Port for SSL
  secure: true, // SSL enabled
  auth: {
    user: process.env.EMAIL_USER, // Gmail email
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
  debug: true, // Enable debugging for logs
  logger: true, // Enable logging
});

// Function to send email
const sendEmail = async (recipients, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"Baku Bantu" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(recipients) ? recipients.join(', ') : recipients,
      subject: subject,
      html: message,
    });
    
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Template for activation email
const sendActivationEmail = async (volunteer) => {
  const subject = 'Selamat! Kamu Diterima Menjadi Volunteer Baku Bantu 🎉';
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Halo ${volunteer.namaLengkap},</h2>
      <p><strong>Selamat! 🎉</strong></p>
      <p>Kami dengan senang hati mengabarkan bahwa kamu telah dinyatakan diterima sebagai Volunteer Baku Bantu. Terima kasih telah mendaftar dan menunjukkan antusiasme untuk menjadi bagian dari gerakan kebaikan ini.</p>
      <p>Sebagai volunteer, kamu akan berkontribusi dalam berbagi kebaikan dan membantu masyarakat, serta menjadi bagian dari komunitas yang saling mendukung dan berdampak langsung bagi masyarakat.</p>
      <p>Kami akan mengirimkan informasi selengkapnya terkait tugas dan jadwal kamu melalui email selanjutnya.</p>
      <p>Jika ada pertanyaan atau kendala, jangan ragu untuk menghubungi kami.</p>
      <p>Sekali lagi, selamat bergabung di keluarga Baku Bantu! Mari kita berbagi, bertumbuh, dan bergerak bersama 💛</p>
      <p>
        Salam hangat,<br/>
        <strong>Krisan Valerie Sangari/Tim Baku Bantu</strong><br/>
        Baku Bantu<br/>
        <a href="mailto:bakubantusulut@gmail.com">bakubantusulut@gmail.com</a>
      </p>
    </div>
  `;
  
  return sendEmail(volunteer.email, subject, message);
};

// Template for deactivation email
const sendDeactivationEmail = async (volunteer) => {
  const today = new Date().toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const subject = 'Informasi Status Keaktifan Volunteer di Baku Bantu';
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Halo ${volunteer.namaLengkap},</h2>
      <p>Terima kasih atas kontribusi dan dedikasi yang telah kamu berikan selama menjadi bagian dari keluarga Baku Bantu. Kami sangat menghargai setiap waktu, tenaga, dan semangat yang telah kamu curahkan untuk mendukung berbagai kegiatan sosial bersama kami.</p>
      <p>Melalui email ini, kami ingin menginformasikan bahwa per tanggal ${today}, status kamu sebagai volunteer di Baku Bantu telah berubah menjadi tidak aktif.</p>
      <p>Meskipun statusmu saat ini tidak aktif, pintu kami selalu terbuka lebar untukmu. Jika di kemudian hari kamu ingin kembali bergabung atau berkontribusi dalam program-program Baku Bantu berikutnya, kami sangat senang menyambutmu kembali.</p>
      <p>Semoga pengalaman selama menjadi volunteer bersama kami memberikan kesan yang berarti dan bermanfaat. Terima kasih telah menjadi bagian dari perjalanan kami 💛</p>
      <p>Sampai jumpa di kesempatan selanjutnya!</p>
      <p>
        Salam hangat,<br/>
        <strong>Krisan Valerie Sangari/Tim Baku Bantu</strong><br/>
        Baku Bantu<br/>
        <a href="mailto:bakubantusulut@gmail.com">bakubantusulut@gmail.com</a>
      </p>
    </div>
  `;
  
  return sendEmail(volunteer.email, subject, message);
};

// Template for admin creation email
const sendAdminCreationEmail = async (volunteer, defaultPassword) => {
  const subject = 'Selamat! Kamu Telah Menjadi Admin di Baku Bantu 🎉';
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Halo ${volunteer.namaLengkap},</h2>
      <p>Kami dengan bangga menginformasikan bahwa kamu telah dipilih untuk menjadi Admin di Baku Bantu!</p>
      <p>Terima kasih atas kontribusi luar biasa yang telah kamu tunjukkan selama menjadi volunteer. Kini, kamu akan memegang peran baru yang lebih strategis untuk mendukung koordinasi dan pengelolaan program.</p>
      <p>Berikut adalah detail akun admin kamu:</p>
      <p>
        <strong>Email:</strong> ${volunteer.email}<br/>
        <strong>Password:</strong> ${defaultPassword}
      </p>
      <p>Kamu bisa login ke dashboard admin melalui link berikut:</p>
      <p style="text-align: center;">
        <a href="http://localhost:3000/login" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🔗 Login ke Dashboard Admin</a>
      </p>
      <p>Setelah login, kamu akan dapat:</p>
      <ul>
        <li>Memantau progres kegiatan</li>
        <li>Mengakses fitur-fitur khusus untuk tim inti</li>
      </ul>
      <p>Kami sarankan untuk segera login dan mengganti password demi keamanan akunmu. Jika mengalami kendala teknis atau butuh panduan penggunaan dashboard, jangan ragu untuk menghubungi tim kami.</p>
      <p>Sekali lagi, selamat atas peran barumu. Mari terus bergerak bersama, memberi dampak yang lebih luas 💛</p>
      <p>
        Salam hangat,<br/>
        <strong>Krisan Valerie Sangari/Tim Baku Bantu</strong><br/>
        Baku Bantu<br/>
        <a href="mailto:bakubantusulut@gmail.com">bakubantusulut@gmail.com</a>
      </p>
    </div>
  `;
  
  return sendEmail(volunteer.email, subject, message);
};

module.exports = {
  sendEmail,
  sendActivationEmail,
  sendDeactivationEmail,
  sendAdminCreationEmail
};
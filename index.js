require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

console.log('جاري بدء إرسال الإيميلات المجدولة عبر GitHub Actions...');

fs.createReadStream('emails.csv')
    .pipe(csv())
    .on('data', (row) => {
        const mailOptions = {
            from: process.env.USER,
            to: row.Email,
            subject: 'رسالة أتمتة يومية',
            text: `أهلاً ${row.Name}، دي رسالة مبعوتة بشكل تلقائي من السيرفر!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`حدث خطأ أثناء إرسال الإيميل لـ ${row.Email}:`, error);
            } else {
                console.log(`تم إرسال الإيميل بنجاح لـ ${row.Email}`);
            }
        });
    })
    .on('end', () => {
        console.log('تمت قراءة ملف الـ CSV وإرسال الدفعة بنجاح.');
    });
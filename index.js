const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();
// إعدادات Nodemailer (استبدل البيانات ببيانات إيميلك الحقيقية)
const transporter = nodemailer.createTransport({
    service: 'gmail', // أو أي خدمة تانية بتستخدمها
    auth: {
        user: process.env.USER,
        pass: process.env.PASS // استخدم الـ App Password لو مفعل الـ 2FA
    }
});

// قراءة ملف الـ CSV
fs.createReadStream('emails.csv')
    .pipe(csv())
    .on('data', (row) => {
        // نفترض إن ملف الـ CSV فيه عمودين: Name و Email
        const mailOptions = {
            from: process.env.USER,
            to: row.Email, // بيقرأ الإيميل من الملف
            subject: 'رسالة أتمتة تجريبية',
            text: `أهلاً ${row.Name}، دي رسالة مبعوتة بشكل تلقائي!`
        };

        // إرسال الإيميل
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`حدث خطأ أثناء إرسال الإيميل لـ ${row.Email}:`, error);
            } else {
                console.log(`تم إرسال الإيميل بنجاح لـ ${row.Email}: ` + info.response);
            }
        });
    })
    .on('end', () => {
        console.log('تمت قراءة ملف الـ CSV بالكامل.');
    });

    // تشغيل السكريبت كل يوم الساعة 9:00 صباحاً
// لو عايز تجربه دلوقتي فوراً وتخليه يشتغل كل دقيقة، غير القيمة دي لـ '* * * * *'
cron.schedule('* * * * *', () => {
    sendEmails();
});
console.log('تم جدولة إرسال الإيميلات كل يوم الساعة 9:00 صباحاً.');
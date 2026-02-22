# استخدام نسخة خفيفة من Node.js
FROM node:18-alpine

# تحديد مجلد العمل داخل الـ Container
WORKDIR /app

# نسخ ملفات الـ package عشان نسطب المكتبات
COPY package*.json ./

# تسطيب المكتبات
RUN npm install

# نسخ باقي ملفات المشروع (الكود وملف الـ CSV)
COPY . .

# تشغيل السكريبت
CMD ["node", "index.js"]
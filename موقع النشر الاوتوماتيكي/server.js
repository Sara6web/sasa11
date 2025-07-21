const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// توفير ملفات الواجهة من مجلد public
app.use(express.static('public'));

// استقبال الطلبات على الرابط الأساسي
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});

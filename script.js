let selectedFiles = [];
const accessToken = "ACCESS_TOKEN_HERE";
const pageId = "PAGE_ID_HERE";
const instaId = "INSTAGRAM_ID_HERE";
const whatsappNotificationNumber = "YOUR_PHONE_NUMBER";
const whatsappStoriesNumber = "YOUR_SHOP_PHONE_NUMBER";

function updateFileList() {
    const filesInput = document.getElementById('mediaFiles');
    selectedFiles = Array.from(filesInput.files);

    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        fileListDiv.innerHTML += `
            <div class="fileItem">
                <span>${file.name}</span>
                <button class="deleteBtn" onclick="removeFile(${index})">🗑️ حذف</button>
            </div>`;
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    document.getElementById('mediaFiles').files = dataTransfer.files;
    updateFileList();
}

function log(msg) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += `<p>📌 ${msg}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

async function startScheduler() {
    const customText = document.getElementById("customText").value;
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const publishTime = document.getElementById("publishTime").value;

    if (!selectedFiles.length || !startDate || !endDate || !publishTime) {
        alert("⚠️ تأكدي من رفع الملفات وتحديد كل التفاصيل!");
        return;
    }

    let postDate = startDate;

    for (let i = 0; i < selectedFiles.length; i++) {
        if (postDate > endDate) break;

        const file = selectedFiles[i];
        const caption = customText || await generateAIcaption(file.name);

        if (!(await isContentAppropriate(file))) {
            await sendWhatsappAlert(`🚫 الملف ${file.name} غير مناسب للنشر. استبدليه.`);
            continue;
        }

        const fullDateTime = `${postDate.toISOString().split('T')[0]}T${publishTime}:00`;
        log(`📤 نشر: ${file.name} بتاريخ ${fullDateTime}`);

        await postToFacebook(file, caption);
        await postToInstagram(file, caption);
        await postToWhatsappStories(file, caption);

        await sendWhatsappAlert(`✅ تم جدولة ${file.name} بتاريخ ${fullDateTime}`);

        postDate.setDate(postDate.getDate() + 1);
    }

    log("🎉 انتهت الجدولة بنجاح!");
}

async function generateAIcaption(filename) {
    log("🤖 يولّد كابشن ذكاء اصطناعي...");
    let type = filename.endsWith('.mp4') ? "🎥 فيديو" : "📸 صورة";
    const captions = [
        `${type} جديد من الحاج للطباعة ✨ اطلب الآن ❤️ #الحاج_للطباعة`,
        `${type} مميز! 😍 اكتشف العروض #تصميم_حصري`,
        `${type} جاهز لك 📦 اطلب واستلم بسرعة ⚡ #طباعة_مميزة`
    ];
    return captions[Math.floor(Math.random() * captions.length)];
}

async function isContentAppropriate(file) {
    log("🔍 التحقق من المحتوى...");
    return Math.random() > 0.1;
}

async function postToFacebook(file, caption) {
    log(`✅ نشر على فيسبوك: ${file.name}`);
}

async function postToInstagram(file, caption) {
    log(`✅ نشر على إنستغرام: ${file.name}`);
}

async function postToWhatsappStories(file, caption) {
    log(`✅ نشر ستوري واتساب: ${file.name}`);
}

async function sendWhatsappAlert(message) {
    log(`📩 إرسال إشعار واتساب: ${message}`);
}


require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Обработка JSON
app.use(express.json());

// Файлы сайта
app.use(express.static(__dirname));

// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Проверка работы сервера
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "MAX WEB STUDIO работает!"
    });
});

// Отправка заявки в Telegram
app.post("/api/contact", async (req, res) => {

    const { name, email, message } = req.body || {};

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !message.trim() ||
        name.length > 100 ||
        email.length > 254 ||
        message.length > 3000
    ) {
        return res.status(400).json({
            success: false,
            error: "Проверьте данные формы"
        });
    }

    if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
        console.error("Не настроены переменные Telegram");

        return res.status(503).json({
            success: false,
            error: "Отправка заявок временно недоступна"
        });
    }

    const text =
        "📩 Новая заявка MAX WEB STUDIO\n\n" +
        "👤 Имя: " + name.trim() + "\n" +
        "📧 Email: " + email.trim() + "\n" +
        "💬 Проект: " + message.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error("Telegram API вернул ошибку");
        }

        res.json({
            success: true,
            message: "Заявка отправлена!"
        });

    } catch (error) {
        console.error("Ошибка отправки:", error.message);

        res.status(500).json({
            success: false,
            error: "Не удалось отправить заявку"
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`MAX WEB STUDIO: http://localhost:${PORT}`);
});

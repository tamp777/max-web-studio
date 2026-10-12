
/* =========================================
   MAX WEB STUDIO
   Полный JavaScript для сайта
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. МОБИЛЬНОЕ МЕНЮ
       ===================================== */

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("header nav");

    if (menuButton && navigation) {

        // Настраиваем доступность кнопки меню
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Открыть меню");

        // Открытие и закрытие меню
        menuButton.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );

        });

        // Закрываем меню после выбора ссылки
        const navigationLinks = navigation.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Открыть меню");

            });

        });

        // Закрываем меню клавишей Escape
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                navigation.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Открыть меню");

            }

        });

        // Закрываем меню при нажатии вне него
        document.addEventListener("click", function (event) {

            const clickedInsideMenu = navigation.contains(event.target);
            const clickedMenuButton = menuButton.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {

                navigation.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Открыть меню");

            }

        });

        // Закрываем мобильное меню на большом экране
        window.addEventListener("resize", function () {

            if (window.innerWidth > 768) {

                navigation.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Открыть меню");

            }

        });

    }


    /* =====================================
       2. ПЛАВНАЯ ПРОКРУТКА
       ===================================== */

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            // Пустые ссылки не обрабатываем
            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.getElementById(
                targetId.substring(1)
            );

            if (!target) {
                return;
            }

            event.preventDefault();

            // Учитываем предпочтения пользователя
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Обновляем адрес страницы
            history.pushState(null, "", targetId);

        });

    });


    /* =====================================
       3. КОНТАКТНАЯ ФОРМА
       ===================================== */

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {

        // Отключаем стандартную отправку,
        // поскольку сервер пока не подключён
        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const nameInput = contactForm.querySelector(
                'input[name="name"], input[type="text"]'
            );

            const emailInput = contactForm.querySelector(
                'input[name="email"], input[type="email"]'
            );

            const messageInput = contactForm.querySelector("textarea");

            // Проверяем наличие необходимых полей
            if (!nameInput || !emailInput || !messageInput) {

                showNotification(
                    "Не удалось найти все поля формы.",
                    "error"
                );

                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Проверка имени
            if (name.length < 2) {

                showNotification(
                    "Введите имя минимум из 2 символов.",
                    "error"
                );

                nameInput.focus();
                return;
            }

            // Проверка email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showNotification(
                    "Введите корректный Email.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            // Проверка сообщения
            if (message.length < 10) {

                showNotification(
                    "Сообщение должно содержать минимум 10 символов.",
                    "error"
                );

                messageInput.focus();
                return;
            }
// Отправляем заявку на сервер MAX WEB STUDIO
const submitButton = contactForm.querySelector('[type="submit"]');

if (submitButton) {
    submitButton.disabled = true;
}

try {
    const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        })

    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Ошибка отправки заявки");
    }

    showNotification("Заявка успешно отправлена!", "success");
    contactForm.reset();

} catch (error) {
    showNotification(
        "Не удалось отправить заявку. Попробуйте ещё раз.",
        "error"
    );
    console.error("Ошибка отправки:", error);

} finally {
    if (submitButton) {
        submitButton.disabled = false;
    }
}

        });

    }


    /* =====================================
       4. УВЕДОМЛЕНИЯ
       ===================================== */

    let notificationTimer;

    function showNotification(message, type = "success") {

        // Удаляем старое уведомление
        const oldNotification = document.querySelector(
            ".site-notification"
        );

        if (oldNotification) {
            oldNotification.remove();
        }

        clearTimeout(notificationTimer);

        // Создаём новое уведомление
        const notification = document.createElement("div");

        notification.className = "site-notification";

        notification.textContent = message;

        notification.setAttribute("role", "status");
        notification.setAttribute("aria-live", "polite");

        // Стили уведомления
        Object.assign(notification.style, {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            left: "auto",
            maxWidth: "350px",
            padding: "16px 22px",
            borderRadius: "10px",
            backgroundColor: type === "error" ? "#8b0000" : "#222",
            color: "#fff",
            border: "1px solid #ff2020",
            boxShadow: "0 0 25px rgba(255, 0, 0, 0.3)",
            fontSize: "15px",
            lineHeight: "1.5",
            zIndex: "9999",
            boxSizing: "border-box"
        });

        document.body.appendChild(notification);

        // Автоматически убираем уведомление
        notificationTimer = setTimeout(function () {

            notification.remove();

        }, 5000);

    }


    /* =====================================
       5. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
       ===================================== */

    const sections = document.querySelectorAll("section[id]");
    const menuLinks = document.querySelectorAll('header nav a[href^="#"]');

    if (sections.length > 0 && menuLinks.length > 0) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const sectionId = entry.target.id;

                    menuLinks.forEach(function (link) {

                        const isActive =
                            link.getAttribute("href") === "#" + sectionId;

                        if (isActive) {

                            link.style.color = "red";
                            link.setAttribute("aria-current", "location");

                        } else {

                            link.style.color = "";
                            link.removeAttribute("aria-current");

                        }

                    });

                });

            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {

            sectionObserver.observe(section);

        });

    }


    /* =====================================
       6. КНОПКА "НАВЕРХ"
       ===================================== */

    const scrollTopButton = document.createElement("button");

    scrollTopButton.type = "button";
    scrollTopButton.textContent = "↑";
    scrollTopButton.className = "scroll-top-button";

    scrollTopButton.setAttribute(
        "aria-label",
        "Вернуться наверх"
    );

    Object.assign(scrollTopButton.style, {
        position: "fixed",
         bottom: "12px",
         right: "12px",
        width: "48px",
        height: "48px",
        border: "1px solid #ff2020",
        borderRadius: "50%",
        backgroundColor: "#b30000",
        color: "white",
        fontSize: "26px",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: "1000",
        boxShadow: "0 0 15px rgba(255, 0, 0, 0.35)",
        display: "none"
    });

    document.body.appendChild(scrollTopButton);

    // Показываем кнопку при прокрутке
  function updateScrollButton() {

    const footer = document.querySelector(".footer");

    const footerVisible = footer &&
        footer.getBoundingClientRect().top < window.innerHeight;

    if (window.scrollY > 400 && !footerVisible) {

        scrollTopButton.style.display = "block";

    } else {

        scrollTopButton.style.display = "none";

    }
}

    window.addEventListener("scroll", updateScrollButton, {
        passive: true
    });

    updateScrollButton();

    // Возвращаемся к началу страницы
    scrollTopButton.addEventListener("click", function () {

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });

    });

});


// ==========================================
// MAX WEB STUDIO — SCROLL REVEAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Находим элементы, которые будем анимировать
    const elements = document.querySelectorAll(
        ".services-heading, " +
        ".portfolio-heading, " +
        ".contacts-heading, " +
        ".service-card, " +
        ".portfolio-card, " +
        ".contacts-info, " +
        ".contacts-form-card, " +
        ".services-bottom"
    );

    // Если пользователь отключил анимации,
    // показываем всё без эффектов
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        return;
    }

    // Добавляем классы и задержки
    elements.forEach((element, index) => {

        if (element.classList.contains("contacts-info")) {
            element.classList.add("reveal-left");
        } else if (element.classList.contains("contacts-form-card")) {
            element.classList.add("reveal-right");
        } else {
            element.classList.add("reveal");
        }

        // Карточки появляются по очереди
        if (
            element.classList.contains("service-card") ||
            element.classList.contains("portfolio-card")
        ) {
            const siblings = Array.from(
                element.parentElement.children
            );

            const cardIndex = siblings.indexOf(element);

            element.style.transitionDelay =
                `${Math.max(0, cardIndex) * 120}ms`;
        }
    });

    // Следим за появлением элементов на экране
    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Анимация запускается один раз
                    observer.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px 40px 0px"
        }
    );

    // Начинаем наблюдение
    elements.forEach((element) => {
        observer.observe(element);
    });

});



// PREMIUM MOUSE GLOW

document.querySelectorAll(
    ".service-card, .portfolio-card"
).forEach((card) => {

    card.addEventListener("pointermove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

    });

});



// SCROLL PROGRESS BAR

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateScrollProgress() {
    const scrollTop = window.scrollY;

    const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = scrollHeight > 0
        ? (scrollTop / scrollHeight) * 100
        : 0;

    progressBar.style.width =
        `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();


document.addEventListener("DOMContentLoaded", function () {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    const mouseGlow = document.getElementById("mouseGlow");

    const notifyForm = document.getElementById("notifyForm");
    const emailInput = document.getElementById("email");
    const formMessage = document.getElementById("formMessage");

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdJS4oQfVUQWM1-uT_C5IKMXsxswW8NhnRObrTHbekLbFtELX1sSYZMstO6XU7aIPS/exec";

    function createRollingLaunchDate() {
        const now = new Date();

        const target = new Date(now);
        target.setDate(target.getDate() + 24);
        target.setHours(target.getHours() + 8);
        target.setMinutes(target.getMinutes() + 32);
        target.setSeconds(target.getSeconds() + 19);

        return target;
    }

    let launchDate = createRollingLaunchDate();

    function formatNumber(value) {
        return String(value).padStart(2, "0");
    }

    function updateCountdown() {
        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            return;
        }

        const now = Date.now();
        let distance = launchDate.getTime() - now;

        if (distance <= 0) {
            launchDate = createRollingLaunchDate();
            distance = launchDate.getTime() - now;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        daysElement.textContent = formatNumber(days);
        hoursElement.textContent = formatNumber(hours);
        minutesElement.textContent = formatNumber(minutes);
        secondsElement.textContent = formatNumber(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    window.addEventListener("mousemove", function (event) {
        if (!mouseGlow) return;

        mouseGlow.style.opacity = "1";
        mouseGlow.style.left = `${event.clientX}px`;
        mouseGlow.style.top = `${event.clientY}px`;
    });

    window.addEventListener("mouseleave", function () {
        if (!mouseGlow) return;

        mouseGlow.style.opacity = "0";
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(message, type = "success") {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.classList.remove("success", "error");
        formMessage.classList.add(type);
    }

    if (notifyForm && emailInput) {
        notifyForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            const submitButton = notifyForm.querySelector("button[type='submit']");

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }

            showMessage("Submitting your email...", "success");

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        email: email,
                        source: "dev-log.ir",
                        submittedAt: new Date().toISOString()
                    })
                });

                showMessage("You're on the list. We'll notify you soon 🚀", "success");
                notifyForm.reset();

            } catch (error) {
                console.error("Form submission error:", error);
                showMessage("Something went wrong. Please try again.", "error");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Notify Me";
                }
            }
        });
    }
});

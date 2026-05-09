const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const mouseGlow = document.getElementById("mouseGlow");
const notifyForm = document.getElementById("notifyForm");
const emailInput = document.getElementById("email");
const formMessage = document.getElementById("formMessage");

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

notifyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "#ff8aaa";
        return;
    }

    formMessage.textContent = "Thank you. You will be notified when dev-log.ir launches.";
    formMessage.style.color = "#00e5a8";

    emailInput.value = "";
});

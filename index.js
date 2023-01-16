import { FRONTEND_COURSE as FRONTEND, QUIZ, GAME } from "https://thonly.org/global.mjs";

window.onload = async () => {
    await import(`${FRONTEND}/components/sw-music/element.mjs`);
    await import(`${QUIZ}/components/sw-coin/element.mjs`);

    await import(`${QUIZ}/components/sw-header/element.mjs`);
    await import(`${QUIZ}/components/sw-footer/element.mjs`);
    await import(`${QUIZ}/components/sw-main/sw-home/element.mjs`);
    await import(`${QUIZ}/components/sw-main/sw-game/element.mjs`);
    await import(`${QUIZ}/components/sw-main/element.mjs`);
    if (!window.TESTING) window.clearCache();

    await document.querySelector('sw-main').render();
    document.documentElement.style.backgroundImage = GAME[2];
    document.body.style.display = 'flex';
    await document.querySelector('sw-header').render();
};

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MZQ2F9JMLX');
import { DEVICE } from 'https://thonly.org/global.mjs';
import { attachMouseGestures, attachSwipeGestures } from './swipe.mjs';
import template from './template.mjs';

class SwCard extends HTMLElement {
    #pointer;
    #game;
    #timer;

    #cards;
    #current;
    #level;
    #mode;
    #time;

    #sound;
    #submitted;
    #correct;
    #wrong;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const card = this.shadowRoot.getElementById('card');

        card.addEventListener('swipeNone', this.flip.bind(this));
        card.addEventListener('swipeLeft', e => this.next(e));
        card.addEventListener('swipeRight', e => this.previous(e));
        card.addEventListener('swipeUp', e => this.submit(true));
        card.addEventListener('swipeDown', e => this.submit(false));

        if (DEVICE[0] === 'ios' || DEVICE[0] === 'android') attachSwipeGestures(card)
        else attachMouseGestures(card);
    }

    render(pointer=this.#pointer, game=this.#game) {
        this.#pointer = pointer;
        this.#game = game;
        this.shadowRoot.querySelectorAll("header, main, footer").forEach(element => element.style.display = 'none');
        
        this.#cards = `${this.#pointer}-cards`;
        this.#current = `${this.#pointer}-current`;
        this.#level = `${this.#pointer}-level`;
        this.#mode = `${this.#pointer}-mode`;
        this.#time = `${this.#pointer}-time`;

        this.#sound = `${this.#pointer}-sound`;
        this.#submitted = `${this.#pointer}-submitted`;
        this.#correct = `${this.#pointer}-correct`;
        this.#wrong = `${this.#pointer}-wrong`;

        switch (localStorage.getItem(this.#pointer)) {
            case "finished":
                this.#renderResult();
                break;
            case "rewarded":
                this.#renderResult();
                break;
            case "completed":
                this.#renderResult();
                break;
            default:
                this.renderMode(localStorage.getItem(this.#mode) || 'setting');
        }
    }

    renderMode(mode) {
        localStorage.setItem(this.#mode, mode);
        this.shadowRoot.querySelectorAll("header, main").forEach(element => element.style.display = 'none');

        switch (localStorage.getItem(this.#mode)) {
            case "study":
                localStorage.setItem(this.#sound, localStorage.getItem(this.#sound) || 1);
                this.#renderCard();
                this.shadowRoot.querySelector('main').style.display = 'flex';
                break;
            case "play":
                localStorage.setItem(this.#sound, localStorage.getItem(this.#sound) || 1);
                localStorage.setItem(this.#correct, localStorage.getItem(this.#correct) || 0);
                localStorage.setItem(this.#wrong, localStorage.getItem(this.#wrong) || 0);
                this.#startTimer();
                this.#renderCard();
                this.shadowRoot.querySelector('main').style.display = 'flex';
                break;
            default:
                localStorage.setItem(this.#level, localStorage.getItem(this.#level) || 'junior');
                Object.keys(this.#levels).forEach(level => this.shadowRoot.getElementById(level).textContent = this.#levels[level]);
                this.shadowRoot.querySelector(`option[value=${localStorage.getItem(this.#level)}]`).selected = true;
                this.shadowRoot.querySelectorAll('.mode').forEach(element => element.disabled = this.#game.length === 0);
                this.shadowRoot.querySelector('header').style.display = 'block';
        }
    }

    // HEADER //

    #levels = {
        junior: 9,
        mid: 6,
        senior: 3
    }

    level(event) {
        localStorage.setItem(this.#level, event.target.value);
    }

    volume(event) {
        localStorage.setItem(this.#sound, Number(event.target.id === 'sound'));
        this.shadowRoot.getElementById(event.target.id).style.display = 'none';
        this.shadowRoot.getElementById(event.target.id === 'sound' ? 'silence': 'sound').style.display = 'block';
    }

    speak(event) {

    }

    get cards() {
        const cards = JSON.parse(localStorage.getItem(this.#cards)) || (localStorage.getItem(this.#mode) === 'study' ? this.#game : this.#shuffle([...this.#game, ...this.#shuffle2(this.#game)]));
        localStorage.setItem(this.#cards, JSON.stringify(cards));
        return cards;
    }

    shuffle(event) {
        this.shadowRoot.getElementById('card').animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(360deg)" }], { duration: 500, iterations: 3 });
        localStorage.setItem(this.#cards, JSON.stringify(this.#shuffle(this.cards)));
        localStorage.removeItem(this.#current);
        this.#renderCard();
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    #shuffle2(array) {
        const clone = structuredClone(array);
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i][2], clone[j][2]] = [clone[j][2], clone[i][2]];
        }
        return clone;
    }

    #convertToRoman(num) {
        const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
        let str = '';
        for (let i of Object.keys(roman)) {
            const q = Math.floor(num / roman[i]);
            num -= q * roman[i];
            str += i.repeat(q);
        }
        return str;
    }

    #escapeHTML(html) {
        const escape = document.createElement('textarea');
        escape.textContent = html;
        return escape.innerHTML;
    }

    #unescapeHTML(html) {
        const escape = document.createElement('textarea');
        escape.innerHTML = html;
        return escape.textContent;
    }

    // MAIN //

    #renderCard() {
        const cards = this.cards;
        const sound = Number(localStorage.getItem(this.#sound));
        const mode = localStorage.getItem(this.#mode);
        const current = Number(localStorage.getItem(this.#current));
        if (mode === 'study') this.#startTimer();

        this.shadowRoot.getElementById('total').textContent = cards.length;
        this.shadowRoot.getElementById('scoreboard').firstElementChild.textContent = `${localStorage.getItem(this.#correct)} 👍🏼`;
        this.shadowRoot.getElementById('scoreboard').lastElementChild.textContent = `${localStorage.getItem(this.#wrong)} 👎🏼`;
        this.shadowRoot.getElementById('current').textContent = cards[current] ? this.#convertToRoman(current + 1) : 0;

        this.shadowRoot.getElementById('previous').style.display = (mode === 'study' && current > 0) ? 'inline-block' : 'none';
        this.shadowRoot.getElementById('next').style.display = (mode === 'study' && current < cards.length - 1) ? 'inline-block' : 'none';
        this.shadowRoot.getElementById('flip').style.display = (current < cards.length) ? 'inline-block' : 'none';
        this.shadowRoot.getElementById('quit').style.display = (mode === 'play' && current < cards.length) ? 'inline-block' : 'none';

        this.shadowRoot.getElementById('code').textContent = cards[current] ? cards[current][0] : "TBA";
        this.shadowRoot.getElementById('front').innerHTML = cards[current] ? cards[current][1] : "TBA";
        this.shadowRoot.getElementById('back').innerHTML = cards[current] ? `<code>${this.#escapeHTML(cards[current][2])}</code>` : "TBA"; // <pre></pre> => may need it for code game app

        this.shadowRoot.getElementById('true').disabled = false;
        this.shadowRoot.getElementById('false').disabled = false;
        //this.shadowRoot.getElementById('true').textContent = "True";
        //this.shadowRoot.getElementById('false').textContent = "False";

        this.shadowRoot.getElementById('front').parentElement.classList.remove('flipped');
        this.shadowRoot.getElementById('back').parentElement.classList.remove('flipped');
        this.shadowRoot.getElementById('timer').style.color = 'white';
        
        this.shadowRoot.querySelectorAll("#study, #play").forEach(element => element.style.display = 'none');
        this.shadowRoot.getElementById('sound').style.display = sound ? 'none' : 'block';
        this.shadowRoot.getElementById('silence').style.display = sound ? 'block' : 'none';
        this.shadowRoot.getElementById(mode).style.display = 'block';
        this.shadowRoot.querySelector('main').style.display = 'flex';
    }

    #setTime() {
        localStorage.setItem(this.#time, localStorage.getItem(this.#mode) === 'study' ? new Date() : this.#levelStartTime);
    }

    #startTimer() {
        clearInterval(this.#timer);
        const mode = localStorage.getItem(this.#mode);
        if (localStorage.getItem(this.#time) === null) this.#setTime();
        const time = new Date(localStorage.getItem(this.#time));
        this.shadowRoot.getElementById('timer').textContent = this.#getFormattedDuration((mode === 'study' ? (new Date() - time) : (time - new Date())) / 1000);
        const levelDuration = this.#getFormattedDuration((this.#levelStopTime - new Date()) / 1000);

        this.#timer = setInterval(mode => {
            const timerDuration = this.#getFormattedDuration((mode === 'study' ? (new Date() - time) : (time - new Date())) / 1000);
            this.shadowRoot.getElementById('timer').textContent = timerDuration;
            if (mode === 'study' && timerDuration >= levelDuration) this.#alert(timerDuration === levelDuration);
            if (mode === 'play' && timerDuration <= "00 : 00") this.finish();
        }, 1000, mode);
    }

    #alert(play) {
        this.shadowRoot.getElementById('timer').style.color = 'red';
        if (play && Number(localStorage.getItem(this.#sound))) {
            const alert = new Audio("sounds/alert.mp3");
            alert.play();
        }
    }

    get #levelStartTime() {
        const date = new Date();
        return new Date(date.getTime() + this.#levels[localStorage.getItem(this.#level)]*this.cards.length*1000);
    }

    get #levelStopTime() {
        const date = new Date();
        return new Date(date.getTime() + this.#levels[localStorage.getItem(this.#level)]*1000);
    }

    #getFormattedDuration(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor(totalSeconds % 3600 / 60);
        const s = Math.floor(totalSeconds % 3600 % 60);
    
        const hours = String(h).padStart(2, '0');
        const minutes = String(m).padStart(2, '0');
        const seconds = String(s).padStart(2, '0');
    
        return h > 0 ? `${hours} : ${minutes} : ${seconds}` : `${minutes} : ${seconds}`;
    }

    flip(event) {
        this.shadowRoot.getElementById('front').parentElement.classList.toggle('flipped');
        this.shadowRoot.getElementById('back').parentElement.classList.toggle('flipped');
    }

    next(event) {
        if (localStorage.getItem(this.#mode) === 'study' && Number(localStorage.getItem(`${this.#pointer}-current`)) < this.cards.length - 1) this.#go(1);
    }

    previous(event) {
        if (localStorage.getItem(this.#mode) === 'study' && Number(localStorage.getItem(`${this.#pointer}-current`)) > 0) this.#go(-1);
    }

    #go(skip) {
        this.shadowRoot.getElementById('card').animate([{ transform: "translateX(0%)", opacity: 1 }, { transform: `translateX(${-100*skip}%)`, opacity: 0 }, { transform: "translateX(0%)", opacity: 1 }], { duration: 500, iterations: 1 });
        if (localStorage.getItem(this.#mode) === 'study') this.#setTime();
        if (localStorage.getItem(this.#mode) === 'play') localStorage.setItem(this.#submitted, 0);
        localStorage.setItem(this.#current, Number(localStorage.getItem(this.#current)) + skip);
        this.#renderCard();
    }

    submit(event) {
        if (localStorage.getItem(this.#mode) === 'play' && !Number(localStorage.getItem(this.#submitted))) {
            let alert;
            const cards = this.cards;
            const current = Number(localStorage.getItem(this.#current));
            const choice = typeof event === 'boolean' ? event : event.target.id === 'true';
            const answer = this.#game.some(card => card[0] === cards[current][0] && card[1] === cards[current][1] && card[2] === cards[current][2]);
            
            if (choice === answer) {
                alert = new Audio("sounds/correct.mp3");
                localStorage.setItem(this.#correct, Number(localStorage.getItem(this.#correct)) + 1);
                // if (typeof event === 'boolean') this.shadowRoot.querySelectorAll('#true, #false').forEach(element => element.textContent = "👍🏼")
                // else event.target.textContent = "Correct";
            } else {
                alert = new Audio("sounds/wrong.mp3");
                localStorage.setItem(this.#wrong, Number(localStorage.getItem(this.#wrong)) + 1);
                // if (typeof event === 'boolean') this.shadowRoot.querySelectorAll('#true, #false').forEach(element => element.textContent = "👎🏼")
                // else event.target.textContent = "Wrong";
            }

            localStorage.setItem(this.#submitted, 1);
            this.shadowRoot.getElementById('true').disabled = true;
            this.shadowRoot.getElementById('false').disabled = true;
            if (Number(localStorage.getItem(this.#sound))) alert.play();
            if (Number(localStorage.getItem(`${this.#pointer}-current`)) === this.cards.length - 1) this.finish()
            else this.#go(1);
        }
    }

    exit(event) {
        clearInterval(this.#timer);
        localStorage.setItem(this.#pointer, 0);
        localStorage.removeItem(this.#time);
        localStorage.removeItem(this.#cards);
        localStorage.removeItem(this.#current);
        localStorage.removeItem(this.#submitted);
        localStorage.removeItem(this.#correct);
        localStorage.removeItem(this.#wrong);
        this.renderMode('setting');
    }

    finish() {
        this.#fireworks();
        clearInterval(this.#timer);
        localStorage.setItem(this.#pointer, 'finished');
        localStorage.removeItem(this.#time);
        localStorage.removeItem(this.#mode);
        localStorage.removeItem(this.#current);
        localStorage.removeItem(this.#submitted);
        this.render();
    }

    // FOOTER //

    #fireworks() {
        const alert = new Audio("sounds/clap.mp3");
        if (Number(localStorage.getItem(this.#sound))) alert.play();
        this.shadowRoot.getElementById('fireworks').classList.add('fireworks');
        setTimeout(() => this.shadowRoot.getElementById('fireworks').classList.remove('fireworks'), 20000);
    }

    #renderResult() {    
        const cards = this.cards;
        const correct = Number(localStorage.getItem(this.#correct));
        const wrong = Number(localStorage.getItem(this.#wrong));

        const score = cards.length > 0 ? Math.round((correct - wrong) / cards.length * 100) : 0;
        const Score = this.#setScore(score);

        this.shadowRoot.getElementById('correct').textContent = correct;
        this.shadowRoot.getElementById('wrong').textContent = wrong;
        this.shadowRoot.getElementById('left').textContent = cards.length - correct - wrong;
        this.shadowRoot.getElementById('high').textContent = score > Score ? "New High" : "Score";
        this.shadowRoot.getElementById('highest').textContent = Score + "%";
        this.shadowRoot.getElementById('score').textContent = score + "%";

        this.shadowRoot.getElementById('restart').disabled = localStorage.getItem(this.#pointer) === "completed";
        this.shadowRoot.getElementById('restart').style.textDecorationLine = localStorage.getItem(this.#pointer) === "completed" ? "line-through" : "none";
        this.shadowRoot.getElementById('collect').disabled = true;
        this.shadowRoot.getElementById('collect').style.textDecorationLine = localStorage.getItem(this.#pointer) === "completed" ? "line-through" : "none";

        this.shadowRoot.getElementById('level').textContent = `Level ${localStorage.getItem(this.#level).capitalize()}`;
        this.shadowRoot.querySelector('main').style.display = 'none';
        this.shadowRoot.querySelector('footer').style.display = 'block';
    }

    #setScore(score) {
        const levelScore = `${this.#pointer}-score-${localStorage.getItem(this.#level)}`;
        let Score = localStorage.getItem(levelScore);
        Score = Score === null ? score : Number(Score);
        localStorage.setItem(levelScore, Math.max(Score, score));
        return Score;
    }

    restart(event) {
        localStorage.setItem(this.#pointer, 0);
        localStorage.removeItem(this.#cards);
        localStorage.removeItem(this.#correct);
        localStorage.removeItem(this.#wrong);
        this.render();
    }

    collect(event) {

    }
}

customElements.define("sw-card", SwCard);
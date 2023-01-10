import template from './template.mjs';

class SwCard extends HTMLElement {
    #pointer;
    #game;

    #level;
    #mode;
    #timer;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(pointer=this.#pointer, game=this.#game) {
        this.#pointer = pointer;
        this.#game = game;
        this.#level = `${this.#pointer.split('-')[0]}-level`;
        this.#mode = `${this.#pointer.split('-')[0]}-mode`;
        this.shadowRoot.querySelectorAll("header, main, footer").forEach(element => element.style.display = 'none');
        
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
                this.#renderCard();
                this.shadowRoot.querySelector('main').style.display = 'block';
                break;
            case "play":
                this.#startTimer()
                this.#renderCard();
                this.shadowRoot.querySelector('main').style.display = 'block';
                break;
            default:
                this.shadowRoot.getElementById(localStorage.getItem(this.#level) || "junior").selected = true;
                this.shadowRoot.querySelector('header').style.display = 'block';
        }
    }

    level(event) {
        localStorage.setItem(this.#level, event.target.value);
    }

    #renderCard() {
        const current = Number(localStorage.getItem(`${this.#pointer}-current`));
        if (localStorage.getItem(this.#mode) === 'study') this.#startTimer();

        if (this.#game[current]) {
            this.shadowRoot.getElementById('front').innerHTML = this.#game[current][0];
            this.shadowRoot.getElementById('back').innerHTML = `<code>${this.#game[current][1]}</code>`;
        }

        this.shadowRoot.getElementById('total').textContent = this.#game.length;
        this.shadowRoot.getElementById('current').textContent = this.#game[current] ? current + 1 : 0;

        this.shadowRoot.getElementById('previous').style.display = current === 0 ? 'none' : 'inline-block';
        this.shadowRoot.getElementById('next').style.display = current < this.#game.length - 1 ? 'inline-block' : 'none';

        this.shadowRoot.querySelectorAll("#study, #play").forEach(element => element.style.display = 'none');
        this.shadowRoot.getElementById(localStorage.getItem(this.#mode)).style.display = 'block';
        this.shadowRoot.querySelector('main').style.display = 'block';
    }

    next(event) {
        const current = Number(localStorage.getItem(`${this.#pointer}-current`));
        if (current < this.#game.length - 1) localStorage.setItem(`${this.#pointer}-current`, Number(localStorage.getItem(`${this.#pointer}-current`)) + 1);
        this.#renderCard();
    }

    previous(event) {
        const current = Number(localStorage.getItem(`${this.#pointer}-current`));
        if (current > 0) localStorage.setItem(`${this.#pointer}-current`, Number(localStorage.getItem(`${this.#pointer}-current`)) - 1);
        this.#renderCard();
    }

    shuffle(event) {
        this.#shuffle(this.#game);
        this.#renderCard();
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    #startTimer() {
        clearInterval(this.#timer);
        const mode = localStorage.getItem(this.#mode);
        const startTime = mode === 'study' ? new Date() : this.#levelTime;
        this.shadowRoot.getElementById('timer').textContent = this.#getFormattedDuration((mode === 'study' ? (new Date() - startTime) : (startTime - new Date())) / 1000);

        this.#timer = setInterval(mode => {
            const timerDuration = this.#getFormattedDuration((mode === 'study' ? (new Date() - startTime) : (startTime - new Date())) / 1000);
            this.shadowRoot.getElementById('timer').textContent = timerDuration;

            if (mode === 'play' && timerDuration === "00 : 00") this.#renderResult();

        }, 1000, mode);
    }

    get #levelTime() {
        const date = new Date();
        switch (localStorage.getItem(this.#level)) {
            case "junior":
                return new Date(date.getTime() + 10*this.#game.length*1000);
            case "mid":
                return new Date(date.getTime() + 6*this.#game.length*1000);
            case "senior":
                return new Date(date.getTime() + 3*this.#game.length*1000);
        }
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

    exit(event) {
        localStorage.removeItem(this.#mode);
        this.renderMode('setting');
    }

    #renderResult() {
        /*let correct = 0, wrong = 0, skipped = 0;

        this.#game.forEach(problem => {
            const answer = localStorage.getItem(`${this.#pointer}-problem${problem.id}-answer`);
            if (answer === null) {
                skipped++;
            } else {
                if (answer == problem.answer) correct++
                else wrong++;
            }
        });
        
        const score = this.#game.length > 0 ? Math.round((correct - wrong) / this.#game.length * 100) : 0;
        const Score = this.#setScore(score);

        this.shadowRoot.getElementById('correct').textContent = correct;
        this.shadowRoot.getElementById('wrong').textContent = wrong;
        this.shadowRoot.getElementById('skipped').textContent = skipped;
        this.shadowRoot.getElementById('high').textContent = score > Score ? "New High" : "Score";
        this.shadowRoot.getElementById('highest').textContent = Score + "%";
        this.shadowRoot.getElementById('score').textContent = score + "%";

        this.shadowRoot.getElementById('restart').disabled = localStorage.getItem(this.#pointer) === "completed";
        this.shadowRoot.getElementById('restart').style.textDecorationLine = localStorage.getItem(this.#pointer) === "completed" ? "line-through" : "none";
        this.shadowRoot.getElementById('collect').disabled = true;
        this.shadowRoot.getElementById('collect').style.textDecorationLine = localStorage.getItem(this.#pointer) === "completed" ? "line-through" : "none";*/

        this.shadowRoot.querySelector('main').style.display = 'none';
        this.shadowRoot.querySelector('footer').style.display = 'block';
    }

    #setScore(score) {
        let Score = localStorage.getItem(`${this.#pointer}-score`);
        Score = Score === null ? score : Number(Score);
        localStorage.setItem(`${this.#pointer}-score`, Math.max(Score, score));
        return Score;
    }

    restart(event) {
        this.#game.forEach(problem => {
            localStorage.removeItem(`${this.#pointer}-problem${problem.id}-selection`);
            localStorage.removeItem(`${this.#pointer}-problem${problem.id}-answer`);
        });
        localStorage.setItem(this.#pointer, 0);
        localStorage.removeItem(`${this.#pointer}-current`);
        this.render();
    }

    collect(event) {

    }
}

customElements.define("sw-card", SwCard);
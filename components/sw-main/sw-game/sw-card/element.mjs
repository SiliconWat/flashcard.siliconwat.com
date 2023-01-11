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
    #count;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(pointer=this.#pointer, game=this.#game) {
        this.#game = game;
        this.shadowRoot.querySelectorAll("header, main, footer").forEach(element => element.style.display = 'none');
        
        this.#pointer = pointer;
        this.#cards = `${this.#pointer}-cards`;
        this.#current = `${this.#pointer}-current`;
        this.#level = `${this.#pointer}-level`;
        this.#mode = `${this.#pointer}-mode`;
        this.#time = `${this.#pointer}-time`;
        this.#count = `${this.#pointer}-count`;

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
        localStorage.setItem(this.#level, localStorage.getItem(this.#level) || 'junior');
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
                this.shadowRoot.getElementById(localStorage.getItem(this.#level)).selected = true;
                this.shadowRoot.querySelector('header').style.display = 'block';
        }
    }

    level(event) {
        localStorage.setItem(this.#level, event.target.value);
    }

    get cards() {
        const cards = JSON.parse(localStorage.getItem(this.#cards)) || (localStorage.getItem(this.#mode) === 'study' ? this.#game : this.#shuffle([...this.#game, ...this.#shuffle2([...this.#game])]));
        localStorage.setItem(this.#cards, JSON.stringify(cards));
        return cards;
    }

    #renderCard() {
        const mode = localStorage.getItem(this.#mode);
        const current = Number(localStorage.getItem(this.#current));
        if (mode === 'study') this.#startTimer();

        if (this.cards[current]) {
            this.shadowRoot.getElementById('front').innerHTML = this.cards[current][0];
            this.shadowRoot.getElementById('back').innerHTML = `<code>${this.cards[current][1]}</code>`;
        }

        this.shadowRoot.getElementById('total').textContent = this.cards.length;
        this.shadowRoot.getElementById('current').textContent = this.cards[current] ? current + 1 : 0;

        this.shadowRoot.getElementById('previous').style.display = current === 0 ? 'none' : 'inline-block';
        this.shadowRoot.getElementById('next').style.display = current < this.cards.length - 1 ? 'inline-block' : 'none';

        this.shadowRoot.querySelectorAll("#study, #play").forEach(element => element.style.display = 'none');
        this.shadowRoot.getElementById(mode).style.display = 'block';
        this.shadowRoot.querySelector('main').style.display = 'block';
    }

    #setTime() {
        localStorage.setItem(this.#time, localStorage.getItem(this.#mode) === 'study' ? new Date() : this.#levelTime);
    }

    #startTimer() {
        clearInterval(this.#timer);
        const mode = localStorage.getItem(this.#mode);
        if (localStorage.getItem(this.#time) === null) this.#setTime();
        const time = new Date(localStorage.getItem(this.#time));
        this.shadowRoot.getElementById('timer').textContent = this.#getFormattedDuration((mode === 'study' ? (new Date() - time) : (time - new Date())) / 1000);

        this.#timer = setInterval(mode => {
            const timerDuration = this.#getFormattedDuration((mode === 'study' ? (new Date() - time) : (time - new Date())) / 1000);
            this.shadowRoot.getElementById('timer').textContent = timerDuration;
            if (mode === 'play' && timerDuration <= "00 : 00") this.#finish();
        }, 1000, mode);
    }

    get #levelTime() {
        const date = new Date();
        switch (localStorage.getItem(this.#level)) {
            case "junior":
                return new Date(date.getTime() + 10*this.cards.length*1000);
            case "mid":
                return new Date(date.getTime() + 6*this.cards.length*1000);
            case "senior":
                return new Date(date.getTime() + 3*this.cards.length*1000);
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

    next(event) {
        if (Number(localStorage.getItem(`${this.#pointer}-current`)) < this.cards.length - 1) {
            localStorage.setItem(this.#current, Number(localStorage.getItem(this.#current)) + 1);
            this.#go();
        } 
    }

    previous(event) {
        if (Number(localStorage.getItem(`${this.#pointer}-current`)) > 0) {
            localStorage.setItem(this.#current, Number(localStorage.getItem(this.#current)) - 1);
            this.#go();
        }
    }

    #go() {
        if (localStorage.getItem(this.#mode) === 'study') this.#setTime();
        this.shadowRoot.getElementById('true').textContent = "True";
        this.shadowRoot.getElementById('false').textContent = "False";
        this.#renderCard();
    }

    submit(event) {
        const current = Number(localStorage.getItem(this.#current));
        const choice = event.target.id === 'true';
        const answer = this.#game.some(card => card[0] === this.cards[current][0] && card[1] === this.cards[current][1]);

        if (choice === answer) {
            event.target.textContent = "Correct";
        } else {
            event.target.textContent = "Wrong";
        }
    }

    #finish() {
        clearInterval(this.#timer);
        localStorage.removeItem(this.#mode);
        localStorage.removeItem(this.#current);
        localStorage.setItem(this.#pointer, 'finished');
        this.render();
    }

    shuffle(event) {
        localStorage.setItem(this.#cards, JSON.stringify(this.#shuffle(this.cards)));
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
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i][1], array[j][1]] = [array[j][1], array[i][1]];
        }
        return array;
    }

    exit(event) {
        clearInterval(this.#timer);
        localStorage.removeItem(this.#cards);
        localStorage.removeItem(this.#time);
        localStorage.removeItem(this.#current);
        this.renderMode('setting');
    }

    #renderResult() {
        this.shadowRoot.getElementById('level').textContent = `Level ${localStorage.getItem(this.#level).capitalize()}`;

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
        localStorage.setItem(this.#pointer, 0);
        localStorage.removeItem(this.#cards);
        localStorage.removeItem(this.#time);
        this.render();
    }

    collect(event) {

    }
}

customElements.define("sw-card", SwCard);
import template from './template.mjs';

class SwGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(course, c) {
        this.shadowRoot.getElementById('course').textContent = course.capitalize();
        this.shadowRoot.getElementById('chapter').textContent = `Chapter ${c}`;
        this.style.display = 'block';
    }
}

customElements.define("sw-game", SwGame);
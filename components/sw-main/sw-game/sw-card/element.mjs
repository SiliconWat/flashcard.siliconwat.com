import template from './template.mjs';

class SwCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render() {
        
    }
}

customElements.define("sw-card", SwCard);
let template = document.createElement('template');
template.innerHTML = `
<style>
h1 {
  color: #d33;
  font-family: monospace;
}
</style>
<div>
  <h1>About (shadow DOM)</h1>
  <a href='/wc-micro-frontends'>Home</a>
</div>
`;

class About extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }
}
    
customElements.define('about-component', About);
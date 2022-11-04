class Home extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h1>Hello world</h1>
      <a href='about'>About</a>
    `;
  }
}
    
customElements.define('home-component', Home);
class Nav extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <div class="flex flex-row w-full mt-4 mb-8 text-xl border-b-2 border-gray-400 rounded-xl items-stretch">
          <button onclick="window.location.href='index.html'"  class="w-full btn border-0 rounded-0 hover:bg-gray-200 px-4 py-2 hover:border-gray-800">Dialogue</button>
          <button onclick="window.location.href='grammar.html'" class="w-full btn border-0 rounded-0 hover:bg-gray-200 px-4 py-2 hover:border-gray-800">Grammar</button>
          <button onclick="window.location.href='exercises.html'" class="w-full btn border-0 roudned-0 hover:bg-gray-200 px-4 py-2 hover:border-gray-800">Exercises</button>
          <button onclick="window.location.href='vocab.html'" class="w-full btn border-0 rounded-0 hover:bg-gray-200 px-4 py-2 hover:border-gray-800">New Words</button>
      </div>
      `;
      this.querySelector('.btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('my-click', { bubbles: true }));
      });
    }
  }
  customElements.define('top-bar', Nav);
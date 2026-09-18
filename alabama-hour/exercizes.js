class ClozeQuestion extends HTMLElement {
    constructor() {
        super();
        this._currQuestion = 0; // ✅ guaranteed to exist before .data or connectedCallback ever run
      }

    set data(value) { this._data = value; this.render(); }
    get data() { return this._data; }
  
    connectedCallback() {
      if (!this._data && this.hasAttribute('data')) {
        try { this._data = JSON.parse(this.getAttribute('data')); }
        catch (e) { console.error('Bad data attribute on cloze-question', e); }
      }
      this.render();
    }
  
    render() {
    if (!this._data) return;
      const html = this._data[this.currQuestion].text.replace(
        /\{\{(\d+)\}\}/g,
        (_, i) => `<input type="text" class="blank border rounded p-2 text-xl" data-index="${i}" autocomplete="off">`
      );
      const english = this._data[this.currQuestion].english.replace(
        /\[\[(.+?)\]\]/g, `<span class="text-sky-500">$1</span>`
      );
      this.innerHTML = `
        <p class="cloze-sentence"></p>
        <div class="py-4 w-full">
    <div class="py-4 px-8 border rounded bg-slate-200">
        <div class="border rounded py-4 px-8 my-2 bg-white">
            <h3 class="font-bold text-xl">Exercise</h3>
            <p>Fill in the blank with the appropriate form of the provided word to make a sentence that translates to the English sentence below.</p>
            <div class="py-4">
                <div class="flex flex-row">
                    <div class="text-2xl">
                        ${html}
                    <span class="text-sky-500">(<i id="verb">${this._data[this.currQuestion].hint}</i>)</span>
                    </div>
                </div>
                <p class="text-xl">${english}</p>
            </div>
            <div class="flex flex-row">
                <button class="check-btn bg-blue-400 text-white px-8 py-2">
                    Check
                </button>
                <div id="correct" class="hidden text-green-500 my-auto mx-5 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                </div>
                <div id="wrong" class="hidden text-red-500 my-auto mx-5 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>                                                      
                </div>
                <div class="ml-auto pl-2">
                        <button class="special-char p-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl">ĩ</button> 
                        <button class="special-char p-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl">õ</button>
                        <button class="special-char p-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl">ã</button>
                        Add Snotty nose characters to current input
                    </div>
            </div>
        </div>
        <div class="flex flex-row my-4 px-8 justify-between">
            <button id="left-button" class="bg-white hover:bg-gray-100 p-2 rounded-xl ${this.currQuestion > 0 ? '' : 'invisible'}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>                                                      
            </button>
            <button id="right-button" class="bg-white hover:bg-gray-100  p-2 rounded-xl ${this.currQuestion < this._data.length - 1 ? '' : 'invisible'}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>                                                                                                         
            </button>
        </div>
</div>
      `;
      this.querySelector('.check-btn').addEventListener('click', () => this.checkAnswers(this.currQuestion));
      this.querySelectorAll('.blank').forEach(input => {
        input.addEventListener('keydown', e => { if (e.key === 'Enter') this.checkAnswers(this.currQuestion); });
      });
      this._activeInput = this.querySelector('.blank');

  this.querySelectorAll('.special-char').forEach(btn => {
    btn.addEventListener('click', () => this.addToInput(btn.innerHTML));
  });
  this.querySelector('#left-button').addEventListener('click', () => {
     this.currQuestion = (Math.max(0, this.currQuestion - 1));
  });
  this.querySelector('#right-button').addEventListener('click', () => {
    this.currQuestion = (Math.min(this.currQuestion + 1, this._data.length - 1));
  });

}
    set currQuestion(value) {
        this._currQuestion = Math.max(0, Math.min(value, this._data.length - 1));
        this.render();
    }
    get currQuestion() {
        return this._currQuestion;
    }
    addToInput(char) {
    if (!this._activeInput) return;
    this._activeInput.value += char;
    this._activeInput.focus(); // keep focus so consecutive clicks keep appending to the right place
    }

    checkAnswers(i) {
      const blanks = this.querySelectorAll('.blank');
      let allCorrect = true;
      blanks.forEach(input => {
        const idx = Number(input.dataset.index);
        const correct = String(this._data[i].answers[idx]).trim().toLowerCase();
        const given = input.value.trim().toLowerCase();
        const ok = correct === given;
        input.classList.toggle('border-green-400', ok);
        input.classList.toggle('border-red-500', !ok);   
        input.disabled = true;
        if (!ok) {
            input.value = correct;   
            allCorrect = false;
            input.classList.toggle('text-red-500', !ok)
        }  
      });
        const checkBtn = this.querySelector('.check-btn');
        checkBtn.disabled = true;
        checkBtn.classList.toggle('bg-green-400', allCorrect);
        checkBtn.classList.toggle('bg-red-500', !allCorrect);   
        if (allCorrect) this.querySelector('#correct').classList.remove('hidden');
        else this.querySelector('#wrong').classList.remove('hidden');     
      this.dispatchEvent(new CustomEvent('cloze-checked', { detail: { correct: allCorrect }, bubbles: true }));
    }
  }
  customElements.define('cloze-question', ClozeQuestion);
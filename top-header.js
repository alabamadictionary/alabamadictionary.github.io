class TopHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <div class="">
                    <div class="bg-[#a63a2e] flex flex-row flex-1 justify-center">
                            <div class="flex flex-1 navigation" id="myTopnav">
                                <button class="nav selected">Dictionary</button>
                                <button onclick="window.location.href='/about'" class="nav unselected">About</button>
                                <button onclick="window.location.href='/grammar'" class="nav unselected">Lessons</button>
                                <button onclick="window.location.href='/alabama-hour'" class="nav unselected">Alabama Hour</button>
                                <!-- <button onclick="window.location.href='/dialogues.html'" class ="nav unselected">Dialogues</button> -->
                                <button onclick="window.location.href='/tools'" class="nav unselected">Tools</button>
                                <button onclick="pageOftheDay()" class="nav unselected">Random Word</button>
                                <button href="javascript:void(0);" class="icon" onclick="myFunction()">
                                    <i class="fa fa-bars"></i>
                                </button>
                            </div>
                            <div class="four-col" style="padding-left: 1rem; font-weight:300; font-size:28px; display: flex; align-items: center;">
                                <span></span>
                            </div>
                    </div>
                </div>
      `;
      this.querySelector('.btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('my-click', { bubbles: true }));
      });
    }
  }
  customElements.define('top-header', TopHeader);
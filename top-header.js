class TopHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `

<nav class="bg-white sm:bg-[#a63a2e] sticky w-full z-20 top-0 start-0 border-b border-default">
<div class="max-w-screen-xl  flex flex-wrap items-center justify-between mx-auto px-4 py-1">
  <a href="/" class="cursor-pointer flex items-center space-x-3 rtl:space-x-reverse">
      <img src="/static/Alabama-Coushata.png" class="h-7" alt="Alabama Logo" />
      <span class="self-center text-xl text-heading sm:text-gray-200 font-semibold whitespace-nowrap">Alabama Dictionary</span>
  </a>
  <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading sm:text-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
  </button>
  <div class="rounded-xl hidden w-full md:block md:w-auto" id="navbar-default">
    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
      <li>
        <a href="/" class="block py-1 px-3 text-heading sm:text-gray-200 bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Dictionary</a>
      </li>
      <li>
        <a href="/about" class="block py-1 px-3 text-heading sm:text-gray-200 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">About</a>
      </li>
      <li>
        <a href="/grammar" class="block py-1 px-3 text-heading sm:text-gray-200 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Grammar</a>
      </li>
      <li>
        <a href="/alabama-hour" class="block py-1 px-3 text-heading sm:text-gray-200 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Alabama Hour</a>
      </li>
      <li>
        <a href="/tools" class="block py-1 px-3 text-heading sm:text-gray-200 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Tools</a>
      </li>
    </ul>
  </div>
</div>
</nav>
      `;
      this.querySelector('.btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('my-click', { bubbles: true }));
      });
    }
  }
  customElements.define('top-header', TopHeader);

      //   <header>
    //                 <div class="bg-[#a63a2e] flex flex-row flex-1 justify-center">
    //                         <div class="flex flex-1 navigation" id="myTopnav">
    //                             <button class="nav selected">Dictionary</button>
    //                             <button onclick="window.location.href='/about'" class="nav unselected">About</button>
    //                             <button onclick="window.location.href='/grammar'" class="nav unselected">Lessons</button>
    //                             <button onclick="window.location.href='/alabama-hour'" class="nav unselected">Alabama Hour</button>
    //                             <!-- <button onclick="window.location.href='/dialogues.html'" class ="nav unselected">Dialogues</button> -->
    //                             <button onclick="window.location.href='/tools'" class="nav unselected">Tools</button>
    //                             <button onclick="pageOftheDay()" class="nav unselected">Random Word</button>
    //                             <button href="javascript:void(0);" class="icon" onclick="myFunction()">
    //                                 <i class="text-white fa fa-bars"></i>
    //                             </button>
    //                         </div>
    //                 </div>
    //                 </header>
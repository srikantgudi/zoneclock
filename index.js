const t = document.createElement('template');

t.innerHTML = `
<style>
* {
  outline: 0 none;
  font-family: Helvetica;
}
.clock-container {
  box-shadow: 0 2px 10px #999999;
  width: 30vw;
  padding: 2px;
  border-radius: 4px;
  background: linear-gradient(#ccc, #fefefe, #ddd);
}
#title {
  background-color: #666666;
  color: #ffffaa;
  padding: 4px 8px;
  text-align: center;
  border-radius: 10px;
}
#zone {
  font-family: cursive;
  font-size: 20px;
  color: lightcyan;
}
#dt {
  box-shadow: 0 0 4px #999999;
  padding: 4px 8px;
  text-align: center;
  font-size: 18px;
  border-radius: 0 0 20px 20px;
}
svg {
  height: 100%;
  width: 100%;
}
#clock {
  margin-top: 1vh;
}
#sel {
  width: 100%;
  height: 30px;
  font-size: 20px;
  border-radius: 20px 20px 0 0;
}
.clock-face {
  fill: #eee;
  stroke: darkgrey;
}
</style>
<div class="clock-container">
  <div id="title">Zone: <span id='zone'></span></div>
  <div>
    <select id="sel">
    </select>
  </div>
  <div id="dt">???</div>
  <div id="clock">
    <svg viewBox='-50 -50 100 100'>
      <circle class='clock-face' r='48%' />
      <circle r='30%' fill='#cde' />
      <polyline id='thr' fill='blue' points='0,0 5,3 30,0 5,-3' />
      <polyline id='tmi' fill='navy' points='0,0 5,2 40,0 5,-2' />
      <polyline id='tse' fill='olive' points='0,0 5,1 45,0 5,-1' />
    </svg>
  </div>
</div>
`;

class ZoneClock extends HTMLElement {
  constructor() {
    super();
    this.zdt = '';
    this.zone = '';
    this.zones = ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Tokyo'];
    this.timer = null;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(t.content.cloneNode( true ));
    this.refreshClock();
  }
  getEl(id) {
    return this.shadowRoot.querySelector(id);
  }
  refreshClock() {
    this.timer = setInterval(() => {
      this.zdt = new Date().toLocaleString('en-US',{timeZone: this.zone});
      this.getEl('#dt').innerHTML = this.zdt;
      const dt = new Date(this.zdt);
      const hr = dt.getHours();
      const mi = dt.getMinutes();
      const se = dt.getSeconds();
      this.turnAngle('#thr', ((hr * 30 + mi / 2) - 90));
      this.turnAngle('#tmi', ((mi * 6 + se / 10) - 90));
      this.turnAngle('#tse', ((se * 6) - 90));
    }, 1000);
  }
  turnAngle(el, ang) {
    this.shadowRoot.querySelector(el).setAttribute('transform', `rotate(${ang} 0 0)`)
  }
  setZone() {
    this.getEl('#zone').innerHTML = this.zone;
  }

  connectedCallback() {
    this.zone = this.getAttribute('zone');
    this.setZone();
    this.zones.forEach(z => this.getEl("#sel").appendChild(new Option(z,z,true,z === this.zone)));
    this.getEl('#sel').addEventListener('change', e => {
      this.zone = e.target.value;
      this.setZone();
      this.refreshClock();
    })
  }
  disconnectedCallback() {
    clearInterval(this.timer);
    this.getEl('#sel').removeEventListener();
  }
}
customElements.define('zone-clock', ZoneClock);

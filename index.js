const t = document.createElement('template');

t.innerHTML = `
<style>
* {
  outline: 0 none;
  font-family: Helvetica;
  font-size: 14px;
}
.clock-container {
  box-shadow: 0 2px 10px #999999;
  width: 40vw;
  height: 80vh;
  margin: 0 auto;
  padding: 2px;
  border-radius: 4px;
  background: linear-gradient(#ccc, #fefefe, #ddd);
}
#title {
  background-color: #666666;
  color: #ffffaa;
  padding: 4px 8px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}
#zone {
  font-family: cursive;
  font-size: 24px;
  color: lightcyan;
}
#dt {
  box-shadow: 0 0 4px #999999;
  padding: 4px 8px;
  text-align: center;
  font-size: 18px;
  border-radius: 8px 8px 0 0;
}
svg {
  height: 80%;
  width: 100%;
}
#clock {
  margin-top: 4vh;
}
#sel {
  width: 100%;
  height: auto;
  font-size: 20px;
  border-radius: 8px 8px 0 0;
  margin-top: 10px;
}
option {
  height: 30px;
}
#ddn {
  box-sizing: border-box;
  position: absolute;
  left: 4vw;
  z-index: 999;
  height: 22px;
  overflow-y: hidden;
  padding: 4px 20px;
  text-align: center;
  background-color: #f9f9f9;
}
#ddn:hover {
  height: auto;
}
.clock-face {
  fill: #eee;
  stroke: darkgrey;
}
svg {
  height: 80vh;
  width: 100%;
}
</style>
<div class="clock-container">
  <div id="title">Zone: <span id='zone'></span></div>
  <div id="dt">- dt -</div>
  <div>
    <select style="height:inherit" id="sel"></select>
  </div>

  <div id="clock">
    <svg viewBox="-50 -50 100 100">
      <circle class='clock-face' r="50" />
      <circle fill="#def" r="30" />
      <polyline id="thr" fill="blue" points="0,0 5,2.5 25,0 5,-2.5" />
      <polyline id="tmi" fill="blue" points="0,0 5,2 45,0 5,-2" />
      <polyline id="tse" fill="olive" points="0,0 5,1 45,0 5,-1" />
    </svg>
  </div>
</div>
`;

class ZoneClock extends HTMLElement {
  constructor() {
    super();
    this.zdt = '';
    this.zone = '';
    this.zones = [
      {name: 'US-West', zone: 'America/Los_Angeles'},
      {name: 'US-East', zone: 'America/New_York'},
      {name: 'United Kingdom', zone: 'Europe/London'},
      {name: 'Dubai', zone: 'Asia/Dubai'},
      {name: 'India', zone: 'Asia/Kolkata'},
      {name: 'Japan', zone: 'Asia/Tokyo'},
      {name: 'Perth', zone: 'Australia/Perth'},
      {name: 'Sydney', zone: 'Australia/Sydney'},
      {name: 'New Zealand', zone: 'Pacific/Auckland'}
    ];
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
    this.getEl(el).setAttribute('transform', `rotate(${ang})`)
  }
  setZone() {
    this.getEl('#zone').innerHTML = this.zone;
  }

  connectedCallback() {
    this.zone = this.getAttribute('zone');
    this.setZone();
    this.zones.forEach(z => this.getEl("#sel").appendChild(new Option(`${z.name} - ${z.zone}`,z.zone,true,z.zone === this.zone)));
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

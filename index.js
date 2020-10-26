const t = document.createElement('template');

t.innerHTML = `
<style>
* {
  outline: 0 none;
  font-family: Helvetica;
  font-size: 14px;
}
.clock-container {
  boz-sizing: border-box;
  box-shadow: 0 2px 10px #999999;
  width: 300px;
  margin: 0 auto;
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
  height: 100%;
  width: 100%;
}
#clock {
  margin: auto 1%;
}
#sel {
  box-sizing: border-box;
  font-size: 17px;
  width: 100%;
  border-radius: 8px 8px 0 0;
  margin-top: 10px;
}
option {
  height: 30px;
}
.clock-face {
  fill: #eee;
  stroke: darkgrey;
}
select {
  font-size: 12px;
}
svg {
  height: 100%;
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
    <svg height="300" width="300">
      <circle class='clock-face' r="135" cx="150" cy="150" />
      <circle fill='lightcyan' r="120" cx="150" cy="150" />
      <polyline id="thr" fill="blue" points="150,150 155,155 250,150 155,145" />
      <polyline id="tmi" fill="blue" points="150,150 155,155 280,150 155,145" />
      <polyline id="tse" fill="olive" points="150,150 155,152 280,150 155,148" />
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
    this.getEl(el).setAttribute('transform', `rotate(${ang} 150 150)`)
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

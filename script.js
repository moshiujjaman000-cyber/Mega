// ================= MQTT =================
const client = mqtt.connect(
  "wss://0ba3e4bef3b044a9a01dea1c9176bc0e.s1.eu.hivemq.cloud:8884/mqtt",
  {
    username: "Nahid",
    password: "Moshiujjaman2",
    reconnectPeriod: 500
  }
);

const topic = "esp8266/sensors";

// ================= UI =================
const tempEl = document.getElementById("temp");
const humEl = document.getElementById("hum");

// ================= CHART =================
const chart = new Chart(document.getElementById("chart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Temp", data: [] },
      { label: "Humidity", data: [] }
    ]
  },
  options: {
    animation: false
  }
});

// ================= CONNECT =================
client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(topic);
});

// ================= MESSAGE =================
client.on("message", (t, msg) => {

  const data = JSON.parse(msg.toString());

  const temp = Number(data.temperature);
  const hum = Number(data.humidity);

  // update UI
  tempEl.innerText = temp + " °C";
  humEl.innerText = hum + " %";

  const time = new Date().toLocaleTimeString();

  // push data
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(temp);
  chart.data.datasets[1].data.push(hum);

  // keep last 50
  while (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }

  chart.update("none");

  console.log("LIVE:", data);
});

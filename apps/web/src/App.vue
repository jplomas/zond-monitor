<script setup>
import { ref, reactive, onMounted } from "vue";

// setup reactive vars
const percentR = ref(0);
const connected = ref(false);
const percent = ref(0);
const api = reactive({
  data: {
    head_slot: null,
    connection: false,
  },
  size: {
    success: false,
    beacon: null,
    gzond: null,
  }
});

// setup timers
let timer = null;
let sizeTimer = null;

async function getSync() {
  const status = await fetch("http://localhost:3001");
  const apiData = await status.json();
  // console.log(apiData);
  return apiData;
}
async function getSize() {
  const size = await fetch("http://localhost:3001/size");
  const apiData = await size.json();
  console.log(apiData);
  return apiData;
}
onMounted(async (instance) => {
  // get sync state
  const getSyncStatus = async () => {
    const apiData = await getSync();
    percent.value =
      Math.round(
        (parseInt(await apiData.head_slot, 10) /
          (parseInt(await apiData.head_slot, 10) +
            parseInt(await apiData.sync_distance, 10))) *
        100 *
        1000
      ) / 1000;
    percentR.value = Math.round(percent.value);
    api.data = await apiData;
    if (api.data.connection) {
      connected.value = true;
    } else {
      connected.value = false
    };
  };

  // get size status
  const getSizeStatus = async () => {
    const sizeData = await getSize();
    api.size = await sizeData;
  }

  // sync status timer
  timer = setInterval(async () => {
    try {
      getSyncStatus();
    } catch (e) {
      connected.value = false;
    }
  }, 10000);

  // size timer
  sizeTimer = setInterval(async () => {
    try {
      getSizeStatus();
    } catch (e) {
      // TODO: display if unable to get sizes
    }
  }, 10000);

  // get sync state on launch
  try {
    getSyncStatus();
  } catch (e) {
    connected.value = false;
  }

  // get size state on launch
  try {
    getSizeStatus();
  } catch (e) {
    // TODO: display if unable to get sizes
  }

});
</script>

<template>
  <div class="container">
    <hgroup>
      <h2>Zond Monitor</h2>
      <h3>Test Software</h3>
    </hgroup>
    <article v-if="api.size.success">
      <header>Disk space</header>
      <table>
        <thead>
          <th>Beacondata</th>
          <th>Gzonddata</th>
        </thead>
        <tbody>
          <tr>
            <td>
              {{ api.size.beacon }}
            </td>
            <td>
              {{ api.size.gzond }}
            </td>
          </tr>
        </tbody>
      </table>
    </article>
    <article v-if="!api.size.success">
      <header>⚠️ Chain files not found</header>
      <p>
        <small>Cannot find any chain files at paths in config file</small>
      </p>
    </article>
    <article v-if="connected">
      <header>Sync Progress</header>
      {{ percent }} %
      <progress :value="percentR" max="100"></progress>
      <p>
        <small>{{ api.data.head_slot }} blocks downloaded</small><br />
        <small>{{ (parseInt(api.data.sync_distance) + parseInt(api.data.head_slot)) }} current block height</small>
      </p>
      <footer>
        <div id="refreshing"></div> Refreshing
      </footer>
    </article>
    <article v-if="!connected">
      <header>⚠️ Connection failed</header>
      <p>
        <small>Not connected to Zond - is the node running?</small>
      </p>
      <footer>
        <div id="refreshing"></div> Refreshing
      </footer>
    </article>
  </div>
</template>

<style scoped>
#refreshing {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 3px solid rgba(255, 255, 255, .3);
  border-radius: 50%;
  border-top-color: var(--progress-color);
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>

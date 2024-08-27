<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="truchet"></div>

<script type="module">
  import { createApp } from 'vue'
  import TruchetApp from './js/truchet.js'

  createApp(TruchetApp).mount('#truchet')
</script>


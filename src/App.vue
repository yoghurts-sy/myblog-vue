<template>
  <div id="app">
    <Header2 id="header"></Header2>
    <router-view/>
    <Header></Header>
  </div>
</template>

<style>
  #app {
    max-width: 1200px;
    margin: 0 auto;
  }
  #header {
    margin-bottom: 40px;
  }

</style>
<script>
  import Header2 from "./components/Header2";
  import Header from "./components/Header";
  export default {
    components: {Header2, Header}
  }
</script>
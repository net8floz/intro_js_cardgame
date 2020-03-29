<template>
  <div>
    <div class="game-viewer">
      <game-viewer />
    </div>
    <div class="container">
      <login @join="onJoin" v-if="!username" />
      <game :username="username" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Login from './Login.vue';
import Game from './Game.vue';
import GameViewer from '../../components/GameViewer.vue';

// import Login from './Login.vue';
@Component({
  components: { GameViewer, Login, Game }
})
export default class GameView extends Vue {
  private username = '';

  private onJoin(username: string) {
    this.username = username;
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  display: block;
  margin: auto;
  position: relative;
  padding: 0;
}

.game-viewer {
  display: block;
  width: 803px;
  height: 452px;
  margin: auto;
}
</style>

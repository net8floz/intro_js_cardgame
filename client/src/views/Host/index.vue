<template>
  <div class="container">
    <div class="game">
      <game-viewer />
    </div>
    <div class="viewer-list">
      {{ currentPokemon }} <br />
      {{ state }}
      <span v-if="connected">Connected!</span>
      <span v-else>Connecting...</span>
      <div class="title">In Game</div>
      <ul>
        <li v-for="(answer, username) in answers" :key="username">
          <span>{{ username }}</span> - " {{ answer ? answer : 'no answer' }}"
        </li>
      </ul>
    </div>
    <div class="controls">
      <a href="#" @click="generate">Generate</a>
      <a href="#" @click="reveal">Reveal</a>
      <a href="#" @click="lobby">Lobby</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SocketIO from 'socket.io-client';
import GameViewer from '../../components/GameViewer.vue';
type AnswerObject = { [username: string]: string };

@Component({ components: { GameViewer } })
export default class GameView extends Vue {
  private state = 'connecting';
  private players: string[] = [];
  private currentPokemon = '';
  private answers: AnswerObject = {};

  private io = SocketIO({ autoConnect: false });

  private connected = false;

  private mounted() {
    this.io.on('connect', this.onSocketConnect.bind(this));
    this.io.on('error', (err: unknown) => {
      console.error(err);
    });
    this.io.connect();
  }

  private beforeDestroy() {
    this.io.removeAllListeners();
  }

  private onSocketConnect() {
    this.connected = true;

    this.io.emit('join-host', (success: string) => {
      console.log('join', success);
    });

    this.io.on('set-state', (state: string) => {
      this.state = state;
    });

    this.io.on('set-players', (players: string[]) => {
      this.players = players;
    });

    this.io.on('set-current-pokemon', (currentPokemon: string) => {
      this.currentPokemon = currentPokemon;
    });

    this.io.on('set-player-answers', (answers: AnswerObject) => {
      this.answers = answers;
    });
  }

  private generate() {
    this.io.emit('set-state', 'generate');
  }

  private reveal() {
    this.io.emit('set-state', 'result');
  }

  private lobby() {
    this.io.emit('set-state', 'lobby');
  }

  private onSocketDisconnect() {
    this.connected = false;
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

.game {
  width: 803px;
  height: 452px;
  margin: 20px;
  position: relative;
  float: left;
}

.controls {
  text-align: center;
  a {
    display: inline-block;
  }
}

.viewer-list {
  width: 200px;
  height: 600px;
  background-color: #333;
  display: inline-block;
  margin: 20px;
  color: #fff;
  position: relative;
  padding: 30px;

  .title {
    font-size: 30px;
    margin: 12px;
  }
}
</style>

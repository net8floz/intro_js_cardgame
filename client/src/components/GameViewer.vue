<template>
  <div>
    <canvas ref="game" class="game"></canvas>
    <div>state: {{ state }}</div>
    <div>currentPokemon: {{ currentPokemon }}</div>
    <div>cardCount: {{ cardCount }}</div>
  </div>
</template>

<script lang="ts">
/* eslint-disable prettier/prettier */
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import Game, { State } from '../game/game';
import SocketIO from 'socket.io-client';

@Component
export default class GameViewer extends Vue {
  @Ref('game') private gameEl!: HTMLCanvasElement;

  private game: Game = new Game();

  private state: State = 'lobby';
  private currentPokemon = '';
  private cardCount = 0;

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
    this.game.release();
    this.io.removeAllListeners();
  }

  @Watch('state')
  private onStateChange(state: State) {
    this.game.setState(state);
  }

  private onSocketConnect() {
    this.connected = true;

    this.io.emit('join-viewer', (data: { currentPokemon: string; cardCount: number; state: State }) => {
      this.currentPokemon = data.currentPokemon;
      this.cardCount = data.cardCount;
      this.state = data.state;
      this.game.mount(this.gameEl, data.state as State, data.cardCount, data.currentPokemon);
    });

    this.io.on('set-state', (state: State) => {
      this.state = state;
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
.game {
  width: 803px;
  height: 452px;
}
</style>

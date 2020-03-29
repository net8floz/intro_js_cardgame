<template>
  <div class="game">
    <div class="username">{{ username }}</div>
    <div class="message" v-if="state === 'message'">
      Connecting to server...
    </div>
    <div v-else-if="state === 'lobby'">
      <div class="message">
        Awaiting players...
      </div>
    </div>
    <div v-else-if="state === 'answer'">
      <div class="form" v-if="!answerSubmitted">
        <label>Who's that pokemon?</label>
        <input v-model="answer" />
        <a href="#" @click="submitAnswer">Submit Answer</a>
      </div>
      <div class="message" v-else>
        Your Answer: {{ answer }} <br />
        Watch the host to see if you're correct!
      </div>
    </div>
    <div class="message" v-else-if="state === 'result'">
      Your Answer: {{ answer }} <br />
      Wait for the next round!
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SocketIO from 'socket.io-client';

@Component
export default class GameView extends Vue {
  private answer = '';
  private answerSubmitted = false;
  private state = 'message';
  private io = SocketIO({ autoConnect: false });
  @Prop(String) private username!: string;

  private mounted() {
    this.io.on('connect', this.onSocketConnect.bind(this));
    this.io.on('error', (err: unknown) => {
      console.error(err);
    });
    this.io.connect();
  }

  private onSocketConnect() {
    this.io.emit('join-player', this.username, (success: string) => {
      console.log('join', success);
    });

    this.io.on('set-state', (state: string) => {
      this.state = state;
      if (state === 'answer') {
        this.answerSubmitted = false;
      }
      if (state === 'generated') {
        this.answer = '';
      }
    });
  }

  private beforeDestroy() {
    this.io.removeAllListeners();
    this.io.disconnect();
  }

  private submitAnswer() {
    if (!this.answer) {
      alert('Enter a username you noob');
      return;
    }
    this.io.emit('submit-answer', this.answer);
    this.answerSubmitted = true;
  }
}
</script>

<style lang="scss" scoped>
.game {
  display: block;
  width: 803px;
  height: 452px;
  padding: 50px;
  text-align: center;
  background-color: #444;
  margin: auto;

  .username {
    color: white;
    display: block;
    margin-bottom: 20px;
  }

  .message {
    border-radius: 40px;
    background-color: #333;
    display: inline-block;
    padding: 20px;
    color: #fff;
    font-size: 20px;
  }
}
</style>

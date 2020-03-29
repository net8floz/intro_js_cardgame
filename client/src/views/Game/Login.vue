<template>
  <div class="form">
    <label>Enter Your Username</label>
    <input v-model="username" placeholder="your name" />
    <a href="#" @click="join">Join</a>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoginView extends Vue {
  private username = 'net8floz';

  private join() {
    if (!this.username) {
      alert('Enter a username you noob');
      return;
    }
    this.$emit('join', this.username);
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: block;
  width: 803px;
  height: 452px;
  padding: 50px;
  text-align: center;
  background-color: #444;
  margin: auto;
}
</style>

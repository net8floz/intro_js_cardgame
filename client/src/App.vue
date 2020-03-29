<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

* {
  box-sizing: border-box;
}

body {
  background-color: #111;
  font-family: 'Roboto', sans-serif;
  color: white;
}

.form {
  label {
    display: block;
    color: white;
    font-size: 32px;
    margin-bottom: 12px;
  }

  input {
    font-size: 20px;
    width: 300px;
    padding: 20px;
    border-radius: 40px;
    text-align: center;
  }
}

a {
  display: block;
  width: 200px;
  height: 60px;
  background-color: #333;
  margin: 30px auto;
  color: white;
  line-height: 50px;
  border-radius: 40px;
  transition: 0.4s;
  text-align: center;

  &:hover {
    background-color: white;
    color: #333;
  }
}
</style>

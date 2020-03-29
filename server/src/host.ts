import store, { State, AnswerObject } from './store';

export async function host(io: SocketIO.Server, socket: SocketIO.Socket, ack: (success: boolean) => void): Promise<void> {
  ack(true);

  socket.emit('set-state', store.get('state'));
  socket.emit('set-players', store.get('players'));

  const states = {
    lobby: (): void => {
      // do nothing
    },
    generate: (): void => {
      const options = store.get<string[]>('pokeOptions');
      store.set('currentPokemon', options[Math.floor(Math.random() * (options.length - 1))]);
      store.set<State>('state', 'answer');
    },
    answer: (): void => {
      const answers = store.get<AnswerObject>('playerAnswers');
      for (const [username] of Object.entries(answers)) {
        answers[username] = '';
      }
      store.set('playerAnswers', answers);
    },
    result: (): void => {
      // do nothing
    }
  };

  socket.on('set-state', (state: State) => {
    store.set('state', state);
  });

  store.events.on('state', (state: string) => {
    io.emit('set-state', state);
    states[state]();
  });

  store.events.on('players', (players: string[]) => {
    socket.emit('set-players', players);

    const answers = store.get<AnswerObject>('playerAnswers');
    for (const player of players) {
      if (!answers[player]) {
        answers[player] = '';
      }
    }

    for (const [username] of Object.entries(answers)) {
      if (players.indexOf(username) < 0) {
        delete answers[username];
      }
    }

    store.set('playerAnswers', answers);
  });

  store.events.on('currentPokemon', (currentPokemon: string) => {
    socket.emit('set-current-pokemon', currentPokemon);
  });

  store.events.on('playerAnswers', (answers: AnswerObject) => {
    socket.emit('set-player-answers', answers);
  });
}

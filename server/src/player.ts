import store, { AnswerObject } from './store';

export async function player(socket: SocketIO.Socket, username: string, ack: (success: boolean) => void): Promise<void> {
  ack(true);
  const players = store.get<string[]>('players');
  players.push(username);
  store.set('players', players);
  socket.emit('set-state', store.get('state'));

  socket.on('disconnect', () => {
    const players = store.get<string[]>('players');
    players.splice(players.indexOf(username), 1);
    store.set('players', players);

    const answers = store.get<string[]>('playerAnswers');
    delete answers[username];
    store.set('playerAnswers', answers);
  });

  socket.on('submit-answer', (answer: string) => {
    const answers = store.get<AnswerObject>('playerAnswers');
    answers[username] = answer;
    store.set('playerAnswers', answers);
  });
}

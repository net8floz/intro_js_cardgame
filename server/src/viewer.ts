import store from './store';

export async function viewer(socket: SocketIO.Socket, ack: (data: { state: string; cardCount: number; currentPokemon: string }) => void): Promise<void> {
  const state = store.get<string>('state');
  const cardCount = store.get<[]>('pokeOptions').length;
  const currentPokemon = store.get<string>('currentPokemon');
  ack({ state, cardCount, currentPokemon });
  console.log('Viewer connected');
}

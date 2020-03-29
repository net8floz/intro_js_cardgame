import { EventEmitter } from 'events';

type Key = 'players' | 'currentPokemon' | 'state' | 'pokeOptions' | 'playerAnswers';
export type AnswerObject = { [name: string]: string };
export type State = 'lobby' | 'answer' | 'result' | 'generate';
const store = {
  players: [],
  currentPokemon: '',
  state: 'lobby' as State,
  pokeOptions: ['pikachu', 'charmander'],
  playerAnswers: {} as AnswerObject
};

const events = new EventEmitter();

export default {
  set<T>(key: Key, value: T): void {
    store[key as string] = value;
    events.emit(key, value);
  },
  get<T>(key: Key): T {
    return store[key as string];
  },
  events
};

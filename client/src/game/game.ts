import * as PIXI from 'pixi.js';

export type State = 'lobby' | 'answer' | 'reveal';

export default class Game {
  private state: State = 'lobby';
  private cardCount = 0;
  private currentPokemon = '';
  private app: PIXI.Application | undefined = undefined;
  private resources!: PIXI.IResourceDictionary;
  private stage = new PIXI.Graphics();

  private states: { [name: string]: Function } = {
    lobby: () => {
      this.clearStage();
      this.addBackground();
    },
    answer: () => {
      this.clearStage();
      this.addBackground();
    },
    reveal: () => {
      this.clearStage();
      this.addBackground();
    },
    generate: () => {
      this.clearStage();
      this.addBackground();
    }
  };

  public mount(view: HTMLCanvasElement, state: State, cardCount: number, currentPokemon: string) {
    this.cardCount = cardCount;
    this.currentPokemon = currentPokemon;

    this.app = new PIXI.Application({ width: 803, height: 452, view });
    this.app.stage.addChild(this.stage);
    new PIXI.Loader().add('/images/pokemon.png').load(loader => {
      this.resources = loader.resources;
      console.log(this.resources);
      this.setState(state);
    });
  }

  public setState(state: string) {
    if (this.app) {
      this.states[state]();
    }
  }

  public setCurrentPokemon(name: string) {
    this.currentPokemon = name;
  }

  private addBackground() {
    const background = new PIXI.Sprite();
    background.texture = this.resources['/images/pokemon.png'].texture;
    this.stage.addChild(background);
  }

  private clearStage() {
    for (var i = this.stage.children.length - 1; i >= 0; i--) {
      this.stage.removeChild(this.stage.children[i]);
    }
  }

  public release() {
    if (this.app) {
      this.app.destroy();
      this.app = undefined;
    }
  }
}

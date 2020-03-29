import * as PIXI from 'pixi.js';

export type State = 'lobby' | 'answer' | 'result';

export default class Game {
  private state: State = 'lobby';
  private cardCount = 0;
  private currentPokemon = '';
  private app: PIXI.Application | undefined = undefined;
  private resources!: PIXI.IResourceDictionary;
  private stage = new PIXI.Graphics();

  private pokeSprites = ['charmander.png', 'litten.png', 'mudkip.png', 'poppilo.png', 'rowlet.png'];

  private states: { [name: string]: Function } = {
    lobby: () => {
      this.clearStage();
      this.addBackground();
      this.showCards();
      console.log('Lobby');
    },
    answer: () => {
      this.clearStage();
      this.addBackground();
      this.showCards();
      this.showHiddenCard();
      console.log('Answer');
    },
    result: () => {
      this.clearStage();
      this.addBackground();
      this.showCards();
      this.revealCard();
      console.log('Reveal');
    },
    generate: () => {
      this.clearStage();
      this.addBackground();
      this.showCards();
      this.showHiddenCard();
      console.log('Generate');
    }
  };

  public mount(view: HTMLCanvasElement, state: State, cardCount: number, currentPokemon: string) {
    this.cardCount = cardCount;
    this.currentPokemon = currentPokemon;

    this.app = new PIXI.Application({ width: 803, height: 452, view });
    this.app.stage.addChild(this.stage);
    const loader = new PIXI.Loader()
      .add('/images/pokemon.png')
      .add('/images/card.png')
      .add('/images/card-back.png')
      .add('/images/axew.jpg');

    this.pokeSprites.forEach(path => loader.add('/images/pokemon/' + path));
    loader.load(loader => {
      this.resources = loader.resources;
      console.log(this.resources);
      this.setState(state);
    });
  }

  public setState(state: string) {
    if (this.app && this.resources) {
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

  private showCards() {
    for (let i = 0; i < this.cardCount; i++) {
      const card = new PIXI.Sprite();
      card.texture = this.resources['/images/card-back.png'].texture;
      card.scale = new PIXI.Point(0.1, 0.1);
      card.x = 160 + Math.random() * 50;
      card.y = 160 + Math.random() * 50;
      card.rotation = -10 + Math.random() * 20;
      this.stage.addChild(card);
    }
  }

  private showHiddenCard() {
    const card = new PIXI.Sprite();
    card.texture = this.resources['/images/card.png'].texture;
    card.scale = new PIXI.Point(0.3, 0.3);
    card.x = 450;
    card.y = 20;
    this.stage.addChild(card);

    const pic = new PIXI.Sprite();
    const tex = this.resources['/images/pokemon/' + this.currentPokemon];
    console.log(this.currentPokemon);
    if (!tex) {
      console.error('Could not find ' + this.currentPokemon);
    }
    pic.texture = this.resources['/images/pokemon/' + this.currentPokemon].texture;
    pic.width = 100;
    pic.height = pic.width * (pic.texture.height / pic.texture.width);
    pic.x = 500;
    pic.y = 140;
    pic.tint = 0;
    this.stage.addChild(pic);
  }

  private revealCard() {
    const card = new PIXI.Sprite();
    card.texture = this.resources['/images/card.png'].texture;
    card.scale = new PIXI.Point(0.3, 0.3);
    card.x = 450;
    card.y = 20;
    this.stage.addChild(card);

    const pic = new PIXI.Sprite();
    pic.texture = this.resources['/images/pokemon/' + this.currentPokemon].texture;
    pic.width = 100;
    pic.height = pic.width * (pic.texture.height / pic.texture.width);
    pic.x = 500;
    pic.y = 140;
    this.stage.addChild(pic);
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

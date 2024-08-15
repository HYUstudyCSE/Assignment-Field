import Phaser from 'phaser';

export class YachtDiceGame extends Phaser.Scene {
  constructor() {
    super({ key: 'YachtDiceGame' });
    this.rollCount = 0;
    this.scoreCount = 0;
    this.dice = [];
    this.holdDice = [];
    this.holdDiceSprites = [];
    this.scores = {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      chance: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yacht: null,
    };
    this.rollDiceSprites = [];
    this.animationPlaying = false;
  }

  preload() {
    for (let i = 1; i <= 6; i++) {
      this.load.image(`dice${i}`, `dice${i}.png`);
    }
    this.load.image('rollButton', 'rollButton.png');
    this.load.image('diceLeft', 'diceLeft.png');
    this.load.image('diceSpace', 'diceSpace.png');
  }

  create() {
    this.createBackground();
    this.createDice();
    this.createRollButton();
    this.createScoreTable();
    this.createRollCountIndicators();
  }

  createBackground() {
    const graphics = this.add.graphics();
    this.colorSection(graphics, 0, 0, this.scale.width, this.scale.height, 0x002055);
    this.colorSection(graphics, 22, 17, 833, 668, 0x000000); // 게임판 그림자1
    this.colorSection(graphics, 30, 25, 831, 666, 0x939393); // 게임판 그림자2
    this.colorSection(graphics, 30, 25, 825, 660, 0x2e2e2e); // 게임판 영역
    this.colorSection(graphics, 60, 235, 765, 240, 0x000000); // 주사위 영역 테두리
    this.colorSection(graphics, 60 + 5, 235 + 4, 765 - 10, 240 - 8, 0xcdddff); // 주사위 영역
    this.colorSection(graphics, 927, 85, 296, 490 + 68, 0xffffff); // 점수표 그림자
    this.colorSection(graphics, 933, 91, 284, 478 + 68, 0x000000); // 점수표 영역
    for (let i = 0; i < 16; i++) {
      let betx = 935 + 190;
      this.colorSection(graphics, 935, 93 + i * 34, betx - 935 - 1, 32, 0xf1edeb); // 점수표 영역
      if(i == 6 || i == 7 || i == 15) this.colorSection(graphics, 935, 93 + i * 34, betx - 935 - 1, 32, 0xcddbf7); // 점수표 영역
      this.colorSection(graphics, betx + 1, 93 + i * 34, 935 + 280 - betx - 1, 32, 0xf1edeb); // 점수표 영역
    }

    for (let i = 0; i < 5; i++) {
      const x = 498 + (i - 2) * 150;
      const y = 190;
      this.add.image(x, y, 'diceSpace').setScale(1);
    }
  }

  colorSection(graphics, x, y, width, height, color) {
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, width, height);
  }

  createDice() {
    for (let i = 0; i < 5; i++) {
      const x = 142 + i * 150;
      const y = 135;
      const dice = this.add.image(x, y, `dice1`).setScale(0.5);
      dice.setVisible(false);
      dice.setInteractive();
      dice.on('pointerdown', () => this.releaseDiceHandler(i));
      dice.on('pointerover', () => dice.setTint(0xeeeeee));
      dice.on('pointerout', () => dice.clearTint());
      this.holdDiceSprites.push(dice);
    }

    for (let i = 0; i < 5; i++) {
      const x = 450 + (i - 2) * 130;
      const y = 357;
      const diceValue = Phaser.Math.Between(1, 6);
      const dice = this.add.image(x, y, `dice${diceValue}`).setScale(0.5);
      dice.setVisible(false);
      dice.setInteractive();
      dice.on('pointerdown', () => this.holdDiceHandler(i));
      dice.on('pointerover', () => dice.setTint(0xeeeeee));
      dice.on('pointerout', () => dice.clearTint());
      this.dice.push(dice);
    }
  }

  createRollCountIndicators() {
    for (let i = 0; i < 3; i++) {
      const x = 390 + i * 50;
      const y = 670;
      const diceLeft = this.add.image(x, y, 'diceLeft').setScale(1);
      this.rollDiceSprites.push(diceLeft);
    }
    this.updateRollCountIndicators();
  }

  createRollButton() {
    this.rollButton = this.add.image(444, 560, 'rollButton').setScale(0.5).setInteractive();
    this.rollButton.on('pointerdown', this.rollDiceHandler, this);
    this.rollButton.on('pointerover', () => this.rollButton.setTint(0xdddddd));
    this.rollButton.on('pointerout', () => this.rollButton.clearTint());
  }

  createScoreTable() {
    const categories = [
      { key: 'ones', text: 'Ones' },
      { key: 'twos', text: 'Twos' },
      { key: 'threes', text: 'Threes' },
      { key: 'fours', text: 'Fours' },
      { key: 'fives', text: 'Fives' },
      { key: 'sixes', text: 'Sixes' },
      { key: 'chance', text: 'Chance' },
      { key: 'threeOfAKind', text: 'Three of Kind' },
      { key: 'fourOfAKind', text: 'Four of Kind' },
      { key: 'fullHouse', text: 'Full House' },
      { key: 'smallStraight', text: 'Small Straight' },
      { key: 'largeStraight', text: 'Large Straight' },
      { key: 'yacht', text: 'Yacht' }
    ];
  
    this.scoreTexts = {};
    categories.forEach((category, index) => {
      const y = 93 + index * 34 + (index > 5 ? 68 : 0);
      this.add.text(1028, y + 16, category.text, { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
  
      const scoreBg = this.add.rectangle(935 + 280 - 45, y + 16, 89, 32, 0xf1edeb).setOrigin(0.5, 0.5).setInteractive();
      scoreBg.on('pointerdown', () => this.confirmScore(category.key));
      scoreBg.on('pointerover', () => scoreBg.setFillStyle(0xffddeb));
      scoreBg.on('pointerout', () => scoreBg.setFillStyle(0xf1edeb));
  
      this.scoreTexts[category.key] = this.add.text(1170, y + 16, '-', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setInteractive();
      this.scoreTexts[category.key].on('pointerdown', () => this.confirmScore(category.key));
      this.scoreTexts[category.key].on('pointerover', () => scoreBg.setFillStyle(0xffddeb));
      this.scoreTexts[category.key].on('pointerout', () => scoreBg.setFillStyle(0xf1edeb));
    });
  
    this.sumText = this.add.text(1170, 110 + 34 * 6, '0', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    this.bonusText = this.add.text(1170, 110 + 34 * 7, '0', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    this.totalText = this.add.text(1170, 110 + 34 * 15, '0', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
  
    this.add.text(1028, 110 + 34 * 6, 'Sum', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    this.add.text(1028, 110 + 34 * 7, 'Bonus', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    this.add.text(1028, 110 + 34 * 15, 'Total', { fontSize: '20px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
  }
  


  updateRollCountIndicators() {
    this.rollDiceSprites.forEach((sprite, index) => {
      if (index < this.rollCount || this.scoreCount >= 13) {
        sprite.setTint(0x888888);
      } else {
        sprite.clearTint();
      }
    });
  }

  holdDiceHandler(index) {
    const dice = this.dice[index];
    if (!this.holdDice.includes(index)) {
      this.holdDice.push(index);
      this.tweens.add({
        targets: dice,
        x: this.holdDiceSprites[index].x,
        y: this.holdDiceSprites[index].y,
        duration: 240,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          dice.x = 450 + (index - 2) * 130;
          dice.y = 357;
          dice.setVisible(false);
          this.holdDiceSprites[index].setTexture(dice.texture.key);
          this.holdDiceSprites[index].setVisible(true);
        },
      });
    }
  }

  releaseDiceHandler(index) {
    const dice = this.dice[index];
    const holdSprite = this.holdDiceSprites[index];
    if (this.holdDice.includes(index)) {
      this.holdDice = this.holdDice.filter((d) => d !== index);
      this.tweens.add({
        targets: holdSprite,
        x: dice.x,
        y: dice.y,
        duration: 240,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          holdSprite.x = 142 + index * 150;
          holdSprite.y = 135;
          dice.setVisible(true);
          holdSprite.setVisible(false);
        },
      });
    }
  }

  rollDiceHandler() {
    if (this.rollCount >= 3 || this.scoreCount >= 13 || this.animationPlaying) {
      return;
    }
    this.dice.forEach((dice, index) => {
      if (!this.holdDice.includes(index)) {
        dice.setVisible(true);
        this.animateDiceRoll(dice, index);
      }
    });

    this.time.delayedCall(300, () => {
      this.dice.forEach((dice, index) => {
        if (!this.holdDice.includes(index)) {
          const diceValue = Phaser.Math.Between(1, 6);
          dice.setTexture(`dice${diceValue}`);
        }
      });

      this.rollCount += 1;
      if (this.scoreCount === 13 || this.rollCount === 3) {
        this.rollButton.setInteractive(false);
        this.rollButton.setTint(0x888888);
      }

      this.updateRollCountIndicators();
      this.updatePossibleScores();
    });
  }

  animateDiceRoll(dice, index) {
    this.animationPlaying = true;
    const rollAnimation = this.time.addEvent({
      delay: 30,
      repeat: 9,
      callback: () => {
        const diceValue = Phaser.Math.Between(1, 6);
        dice.setTexture(`dice${diceValue}`);
      },
      callbackScope: this,
    });

    this.time.delayedCall(rollAnimation.delay * (rollAnimation.repeat + 1), () => {
      rollAnimation.remove(false);
      this.time.addEvent({delay: 300, repeat: 0, callback: () => {this.animationPlaying = false;}, callbackScope: this});
    });
  }

  updatePossibleScores() {
    let diceValues = this.dice.map((dice) =>
      parseInt(dice.texture.key.replace('dice', ''), 10)
    );
    let categories = this.getScoreCategories(diceValues);

    Object.keys(categories).forEach((category) => {
      if (this.scores[category] === null) {
        this.scoreTexts[category].setText(categories[category]);
        this.scoreTexts[category].setStyle({ fill: '#ff0000' });
      }
    });
  }

  confirmScore(category) {
    if (this.rollCount === 0 || this.scores[category] !== null || this.scoreCount >= 13) return; 

    const diceValues = this.dice.map((dice) =>
      parseInt(dice.texture.key.replace('dice', ''), 10)
    );
    const categories = this.getScoreCategories(diceValues);
    const score = categories[category];

    if (this.scores[category] === null) {
      this.scores[category] = score;
      this.scoreTexts[category].setText(score);
      this.scoreTexts[category].setStyle({ fill: '#000' });
      this.scoreCount += 1;
      this.updateSumBonusTotal();
      this.resetRound();
    }
  }

  updateSumBonusTotal() {
    const upperSectionKeys = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const upperSectionSum = upperSectionKeys.reduce((sum, key) => sum + (this.scores[key] || 0), 0);
    const bonus = upperSectionSum >= 63 ? 35 : 0;
    const total = upperSectionSum + bonus + Object.values(this.scores).reduce((total, val) => total + (val || 0), 0);

    this.sumText.setText(upperSectionSum);
    this.bonusText.setText(bonus);
    this.totalText.setText(total);
  }

  resetRound() {
    this.rollCount = 0;
    this.holdDice = [];
    this.dice.forEach((dice) => {
      dice.clearTint();
      dice.setVisible(false);
    });
    this.holdDiceSprites.forEach((sprite) => sprite.setVisible(false));
    if(this.scoreCount < 13) {
      this.rollButton.setInteractive(true);
      this.rollButton.clearTint();
    }

    Object.keys(this.scoreTexts).forEach((category) => {
      if (this.scores[category] === null) {
        this.scoreTexts[category].setText('-');
        this.scoreTexts[category].setStyle({ fill: '#fff' });
      }
    });

    this.updateRollCountIndicators();
  }

  getScoreCategories(diceValues) {
    let counts = {};
    diceValues.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

    let categories = {
      ones: counts[1] ? counts[1] * 1 : 0,
      twos: counts[2] ? counts[2] * 2 : 0,
      threes: counts[3] ? counts[3] * 3 : 0,
      fours: counts[4] ? counts[4] * 4 : 0,
      fives: counts[5] ? counts[5] * 5 : 0,
      sixes: counts[6] ? counts[6] * 6 : 0,
      chance: diceValues.reduce((a, b) => a + b, 0),
      threeOfAKind: Object.values(counts).some((count) => count >= 3)
        ? diceValues.reduce((a, b) => a + b, 0)
        : 0,
      fourOfAKind: Object.values(counts).some((count) => count >= 4)
        ? diceValues.reduce((a, b) => a + b, 0)
        : 0,
      fullHouse:
        Object.values(counts).includes(3) && Object.values(counts).includes(2)
          ? 25
          : 0,
      smallStraight: new Set(diceValues).size >= 4 && this.isSmallStraight(diceValues) ? 30 : 0,
      largeStraight: new Set(diceValues).size === 5 && this.isLargeStraight(diceValues) ? 40 : 0,
      yacht: Object.values(counts).some((count) => count === 5) ? 50 : 0,
    };
    return categories;
  }

  isSmallStraight(diceValues) {
    let straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
    return straights.some((straight) => straight.every((val) => diceValues.includes(val)));
  }

  isLargeStraight(diceValues) {
    let straights = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
    return straights.some((straight) => straight.every((val) => diceValues.includes(val)));
  }
}

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import diceImage from './img/dice.png'
import buttonImage from './img/button.png'

function Game(){
  const phaserGameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: phaserGameRef.current,
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
        this.load.spritesheet('dice', diceImage, { frameWidth: 32, frameHeight: 32 });
        this.load.image('button', buttonImage);
    }
      
    function create() {
        //Dice Part
        this.dices = this.add.container(200,300);
        this.dices.setData({roll: 3, recordEnable: false});

        for (let i = 0; i < 5; i++) {
          const dice = this.add.sprite(-100 + i * 50, 0, 'dice');
          dice.setInteractive();
          dice.on('pointerdown', () => {dice.selected = !dice.selected;});
          dice.setData({value: -1});
          this.dices.add(dice);
        }

        this.rollBtn = this.add.image(300, 500,'button').setTint(0xff0000).setScale(5, 5);
        this.rollBtn.setInteractive();
        this.rollBtn.on('pointerdown', () => {
            const roll = this.dices.getData('roll');
            if(roll == 0)
                return;

            this.dices.list.forEach(dice => {
                if (!dice.selected) {
                  const dots = Phaser.Math.Between(1, 6);
                  dice.setFrame(dots - 1);
                  dice.setData('value', dots);
                }
            });

            this.dices.setData('roll', roll-1);
            this.dices.setData('recordEnable', true);
        });


        //Score Part
        this.scoreBoard = this.add.container(0, 0);

        //버튼에 Calculate 방식으로 계산한거 저장하는 함수
        const recordScore = (num, Calculate) => {
            if(!this.dices.getData('recordEnable') || this.scoreBoard.list[num].getData('isRecorded'))
                return;

            console.log(num);

            this.dices.setData('roll', 3);
            this.dices.list.forEach(dice => {dice.selected = false;});
            this.dices.setData('recordEnable', false);

            this.scoreBoard.list[num].setData({value: Calculate(), isRecorded: true});
            this.scoreBoard.list[num].list[1].setText(`${Calculate()}`);
        }

        //Aces ~ Sixs 점수 계산
        const calNums = (num) => {
            let result = 0;

            this.dices.list.forEach(dice => {
                if(dice.getData('value') == num) 
                    result += num;
            })

            return result;
        }

        //Choice 부분 점수 계산
        const choice = () => {
          let result = 0;

          this.dices.list.forEach(dice => {
            result += dice.getData('value');
          })

          return result;
        }

        //4 of a Kind 부분 점수 계산
        const fourKind = () => {
          let result = 0;
          let dots = [0, 0, 0, 0, 0, 0];

          this.dices.list.forEach(dice => {
            dots[dice.getData('value') - 1] += 1;
            result += dice.getData('value');
          })

          dots.forEach(e => {
            if(e >= 4)
              return result;
          })

          return 0;
        }

        //fullhouse 부분 점수 계산
        const fullHouse = () => {
          let result = 0;
          let dots = [0, 0, 0, 0, 0, 0];
          let two = false;
          let three = false;

          this.dices.list.forEach(dice => {
            dots[dice.getData('value') - 1] += 1;
            result += dice.getData('value');
          })

          dots.forEach(e => {
            if(e==2)
              two = true;
            if(e==3)
              three = true;
          })

          if(two && three)
            return result;
          return 0;
        }

        const sStraight = () => {
          let dots = [0, 0, 0, 0, 0, 0];

          this.dices.list.forEach(dice => {
            dots[dice.getData('value') - 1] += 1;
          })

          if(!(dots[2] >= 1 && dots[3] >= 1))
            return 0;
          if(!((dots[0] >= 1 && dots[1] >= 1) || (dots[1] >= 1 && dots[4] >= 1) || (dots[4] >= 1 && dots[5] >= 1)))
            return 0;
          return 15;
        }

        const lStraight = () => {
          let dots = [0, 0, 0, 0, 0, 0];

          this.dices.list.forEach(dice => {
            dots[dice.getData('value') - 1] += 1;
          })

          if(!(dots[1] >= 1 && dots[2] >= 1 && dots[3] >= 1 && dots[4] >= 1))
            return 0;
          if(!(dots[0] >= 1 || dots[5] >= 1))
            return 0;
          return 30;
        }

        const yacht = () => {
          let dots = [0, 0, 0, 0, 0, 0];

          this.dices.list.forEach(dice => {
            dots[dice.getData('value') - 1] += 1;
          })

          dots.forEach(e => {
            if(e == 5)
              return 50;
          })

          return 0;
        }

        for(let i = 0; i < 12; i++){
            const score = this.add.container(600,25);
            const scoreImg = this.add.image(0, 0 + i * 50, 'button').setScale(4, 4).setInteractive();
            const scoreText = this.add.text(-50, -10 + i * 50, 'scoreText').setFill(0xFFFFFF);

            score.add([scoreImg, scoreText]);

            score.setData({value: 0, isRecorded: false});

            this.scoreBoard.add(score);
        }

        //button text
        const buttonText = ['Aces', 'Deuces', 'Threes', 'Fours', 'Fives', 'Sixes', 'Choice', '4 of a Kind', 'Full House', 'S. Straight', 'L. Straight', 'Yacht'];
        this.scoreBoard.list.forEach((e, index) => {
          e.list[1].setText(buttonText[index]);
        })

        //pointerdown event
        const buttonEvent = [
          () => calNums(1),
          () => calNums(2),
          () => calNums(3),
          () => calNums(4),
          () => calNums(5),
          () => calNums(6),
          choice,
          fourKind,
          fullHouse,
          sStraight,
          lStraight,
          yacht
        ];

        this.scoreBoard.list.forEach((e, index) => {
          e.list[0].on('pointerdown', () => {recordScore(index, buttonEvent[index])});
        })
      }
      

    function update() {
        this.dices.list.forEach(dice => {
            dice.setTint(dice.selected ? 0xff0000 : 0xffffff);
        })
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={phaserGameRef}></div>;
}

export default Game;


import { _decorator, Component, Node, director, Scene, SceneAsset, Game, macro, ProgressBar, ProgressBarComponent, EditBox } from 'cc';
import { PlayerControl } from './PlayerControl';
const { ccclass, property } = _decorator;

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_L_END,
    GS_W_END,
}

@ccclass('GameManager')
export class GameManager extends Component 
{
    
    private hBar;
    private score;

    @property(PlayerControl)
    playControl: PlayerControl = null!;

    @property(Node)
    startMenu: Node = null!;

    @property(Node)
    playerUI: Node = null!;
    
    @property(Node)
    endLMenu: Node = null!;
    
    @property(Node)
    endWMenu: Node = null!;

    @property(Node)
    healthBar: Node = null!;

    @property(Node)
    scoreText: Node = null!;

    set curState(value: GameState)
    {
        switch(value)
        {
            case GameState.GS_PLAYING:
                this.endLMenu.active = false;
                this.endWMenu.active = false;
                this.startMenu.active = false;
                this.playerUI.active = true;
                setTimeout(() => {
                    this.playControl.setInputActive(true);
                }, 0.1);
                break;
            
            case GameState.GS_L_END:
                this.startMenu.active = false;
                this.endWMenu.active = false;
                this.playerUI.active = false;
                this.endLMenu.active = true;
                this.playControl.setInputActive(false);
                break;
            
            case GameState.GS_W_END:
                this.startMenu.active = false;
                this.endLMenu.active = false;
                this.playerUI.active = false;
                this.endWMenu.active = true;
                this.playControl.setInputActive(false);
                break;
                
            default:
                this.endWMenu.active = false;
                this.endLMenu.active = false;
                this.playerUI.active = false;
                this.startMenu.active = true;
                this.playControl.setInputActive(false);
                break;

        }
    }


    reset()
    {
        director.loadScene("main");
        this.playControl.HP = 3;
        this.playControl._curScore = 0;
        this.curState = GameState.GS_INIT;
    }

    onStartButtonClicked()
    {
        this.curState = GameState.GS_PLAYING;
    }

    onRestartButtonClicked()
    {
        this.reset();
    }

    playerMoveLeft()
    {
        this.playControl.move(-2, true, false);
    }

    playerMoveRight()
    {
        this.playControl.move(2, false, true);
    }

    start () 
    {
        this.curState = GameState.GS_INIT;
        this.hBar = this.healthBar.getComponent(ProgressBar);
        this.score = this.scoreText.getComponent(EditBox);
    }

    isEndCondition()
    {
        if(this.playControl.HP == 0)
        {
            this.curState = GameState.GS_L_END;
        }
        if(this.playControl._curScore == 18)
        {
            this.curState = GameState.GS_W_END;
        }
    }

    updateStats()
    {
        var curHP = this.playControl.HP;
        this.hBar.progress = curHP/3.0;
        this.score.string = "Score: " + this.playControl._curScore;
        
    }

    update (deltaTime: number) 
    {
        this.isEndCondition();
        this.updateStats();
    }
}


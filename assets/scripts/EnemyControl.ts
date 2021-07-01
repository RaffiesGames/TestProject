
import { _decorator, Component, Node, Prefab, director, Collider, CollisionEventType, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {
    
    @property
    hitCount: number = 1;

    private curTime:number = 0;

    start ()
    {
        let collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event : ICollisionEvent)
    {
        
        this.hitCount -= 1;
        console.log("ASKFASFASF " + this.hitCount)
        if(this.hitCount == 0)
        {
            event.selfCollider.destroy();
            this.node.destroy();
        }
        event.otherCollider.node.destroy();
    }

    update (deltaTime: number) 
    {
        this.curTime += deltaTime;
    }
}

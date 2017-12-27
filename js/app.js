class Enemy{
    constructor(){
        this.x = -100;
        this.y = 0;
        this.speed = 110;
        this.sprite = 'images/enemy-bug.png';
        this.rect = {
            width:101,
            height:83,
            centerX:0,
            centerY:0,
        };
    }
    // 此为游戏必须的函数，用来更新敌人的位置
    // 参数: dt ，表示时间间隙
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    update(dt) {
        this.x += this.speed*dt;
        if(this.x >= 101*6){
            var index = allEnemies.indexOf(this);
            allEnemies.splice(index,1);
        }
        this.setRect();
    }

    // 此为游戏必须的函数，用来在屏幕上画出敌人，
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    setRect(){
        this.rect.centerX = Math.ceil(this.x + 101/2);
        this.rect.centerY = Math.ceil(this.y + 83/2);
    }
    randomPosition() {
        this.y = Math.floor(Math.random()*3 + 1) * 83 -20;
    }
}

function createEnemy() {
    clearTimeout(enemyTimer);
    var enemy = new Enemy();
    enemy.randomPosition();
    allEnemies.push(enemy);
    var t = Math.round(Math.random() * 1200) + 1000;
    enemyTimer = setTimeout(createEnemy,t);
}

class Player {
    constructor(){
        this.x = 101 * 2;
        this.y = 83 * 5;
        this.sprite = 'images/char-boy.png';
        this.life = 5;
        this.rect = {
            width:101,
            height:83,
            centerX:Math.floor(this.x + 101/2),
            centerY:Math.floor(this.y + 83/2),
        };
    }

    setRect(){
        this.rect.centerX = Math.ceil(this.x + 101/2);
        this.rect.centerY = Math.ceil(this.y + 83/2);
    }

    update(){
        this.setRect();
        this.judgeEnemy();
    }

    resetFace(url) {
        this.sprite = url;
    }

    resetAttr() {
        this.x = 101 * 2;
        this.y = 83 * 5 - 10;
        this.life = 5;
        this.sprite = 'images/char-boy.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        let x = 0,
            y = 0;
        if (key == 'left') {
            x = -101;
        } else if (key == 'right') {
            x = 101;
        } else if (key == 'up') {
            y = -83;
        } else if (key == 'down') {
            y = 83;
        }
        if (this.x + x < 0 || this.x + x > 101 * 4) {
            x = 0;
        }
        if (this.y + y > 83 * 5) {
            y = 0;
        }
        if(this.judgeRocks(x,y))
        {
            x = 0;
            y = 0;
        }
        this.x += x;
        this.y += y;
        this.judgeWin();
    }
    
    judgeWin(){
        if (this.y < 60){
            win();
        }
    }
    judgeRocks(x,y){
        for(let i = 0; i < Rocks.length;i++){
            if(this.collisionDetection(Rocks[i].rect,x,y)){
                return true;
            }
        }
        return false;
    }
    judgeEnemy(){
        //1、判断与所有虫子的碰撞
        for(let i = 0 ; i < allEnemies.length;i++){
            if(this.collisionDetection(allEnemies[i].rect)){
                dead();
            }
        }
    }
    collisionDetection(rect,x = 0,y = 0) {
        let verticalDistance;    //垂直距离
        let horizontalDistance;  //水平距离
        verticalDistance = Math.abs(this.rect.centerX + x - rect.centerX);
        horizontalDistance = Math.abs(this.rect.centerY + y - rect.centerY) + 20;

        let verticalThreshold;   //两矩形分离的垂直临界值
        let horizontalThreshold; //两矩形分离的水平临界值
        verticalThreshold = (this.rect.height + rect.height)/2;
        horizontalThreshold = (this.rect.width + rect.height)/2;

        if(verticalDistance > verticalThreshold || horizontalDistance > horizontalThreshold)
            return false;
        return true;
    }
}


class Rock{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.randomPosition();
        this.rect = {
            width:101,
            height:83,
            centerX:Math.floor(this.x + 101/2),
            centerY:Math.floor(this.y + 83/2),
        };
    }
    render(){
        ctx.drawImage(Resources.get('images/Rock.png'),this.x,this.y);
    }
    setRect(){
        this.rect.centerX = Math.ceil(this.x + 101/2);
        this.rect.centerY = Math.ceil(this.y + 83/2);
    }
    judge(rock) {
        return (this.x == rock.x && this.y == rock.y) ? 1 : 0;
    }
    randomPosition(){
        let x = Math.floor(Math.random()*5)*101;
        let y = Math.floor(Math.random()*3 + 1)*83 -20;
        this.x = x;
        this.y = y;
    }
}
function createRocks() {
    let rocksNum = Math.random() * 3 + 2;
    for(let i = 0 ; i < rocksNum; i++){
        var rock = new Rock();
        judgeRockPosition(rock);
        rock.setRect();
        Rocks.push(rock);
    }
}
function judgeRockPosition(rock) {
    while(1){
        var flag = 0;
        for(let i = 0 ; i < Rocks.length ; i++){
            if (rock.judge(Rocks[i])){
                falg = 1;
                break;
            }
        }
        if(flag){
            rock.randomPosition();
        }else{
            break;
        }
    }
}



var player = new Player();
var allEnemies = new Array();
var Rocks = new Array();
var round = 1;
var score = 0;
var enemyTimer;

function initGame() {
    round = 1;
    score = 0;
    player.resetAttr();
    allEnemies = [];
    Rocks = [];
    $(function () { $("[data-toggle='popover']").popover(); });
    initInterFace();
}

function initInterFace() {
    setRound();
    setHreat();
    var eScore = $('.score')[0];
    eScore.innerHTML = score;
    $('.restart').click(function () {
        restart();
    });
    $('li.player-face').click(function () {
        player.resetFace($(this).find('img').attr('src'));
    });
    $('.btn-start').click(function () {
        createEnemy();
        createRocks();
        $('.cover')[0].style.display = 'none';
    });
}
function restart() {
    round = 1;
    score = 0;
    player.resetAttr();
    allEnemies = [];
    Rocks = [];
    clearTimeout(enemyTimer);
    setRound();
    setHreat();
    $('.cover')[0].style.display = 'flex';
    var eScore = $('.score')[0];
    eScore.innerHTML = score;
}
function setRound() {
    var eround = $(".round")[0];
    eround.innerHTML = round;
}
function setHreat() {
    var life = $('.life')[0];
    $('.life').empty();
    for(let i = 0; i < player.life; i++){
        var hreat = document.createElement('span');
        hreat.className = 'glyphicon glyphicon-heart';
        life.appendChild(hreat);
    }
}

function win() {
    round++;
    setRound();
    score += 100;
    var eScore = $('.score')[0];
    eScore.innerHTML = score;
    player.x = 101 * 2;
    player.y = 83 * 5 - 10;
    allEnemies = [];
    Rocks = [];
    createEnemy();
    createRocks();
}

function dead() {
    player.life--;
    if(player.life <= 0){
        defeated();
        return;
    }
    setHreat();
    player.x = 101 * 2;
    player.y = 83 * 5 - 10;
    allEnemies = [];
    Rocks = [];
    createEnemy();
    createRocks();

}

function defeated() {
    $('.message')[0].innerHTML = `<p>前路漫漫</p><p>难免会有坎坷</p><p>收拾行装</p><p>重新上路</p>`;
    $('.btn-start')[0].innerHTML = '重新开始';
    restart();
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

$(document).ready(function () {
    initGame();
});
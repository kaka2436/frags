class Enemy{
    constructor(speed = 0){
        this.x = -100;
        this.y = 0;
        this.speed = 110 + speed;
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
        this.judgeEffects(x,y);
    }

    judgeWin(){
        if (this.y < 60){
            win();
        }
    }
    judgeEffects(x,y){
        if(heart != null && this.collisionDetection(heart.rect,x,y)){
            if(this.life < 5){
                this.life++;
            }
            heart=null;
            setHreat();
        }else if(key != null && this.collisionDetection(key.rect,x,y)){
            key=null;
            win();
        }else if(GemBlue != null && this.collisionDetection(GemBlue.rect,x,y)){
            GemBlue=null;
            score+=300;
            var eScore = $('.score')[0];
            eScore.innerHTML = score;
        }else if(GemOrange != null && this.collisionDetection(GemOrange.rect,x,y)){
            GemOrange=null;
            score+=600;
            var eScore = $('.score')[0];
            eScore.innerHTML = score;
        }else if(GemGreen != null && this.collisionDetection(GemGreen.rect,x,y)){
            GemGreen=null;
            allEnemies = [];
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
class Item{
    constructor(sprite){
        this.x = 0;
        this.y = 0;
        this.sprite = sprite;
        this.randomPosition();
        this.rect = {
            width:101,
            height:83,
            centerX:Math.floor(this.x + 101/2),
            centerY:Math.floor(this.y + 83/2),
        };
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
    }
    setRect(){
        this.rect.centerX = Math.ceil(this.x + 101/2);
        this.rect.centerY = Math.ceil(this.y + 83/2);
    }
    judge(item) {
        return (this.x == item.x && this.y == item.y) ? 1 : 0;
    }
    judgePosition() {
        while(1){
            var flag = 0;
            for(let i = 0 ; i < Rocks.length ; i++){
                if (this.judge(Rocks[i])){
                    flag = 1;
                    break;
                }
            }
            if(heart != null && this.judge(heart) && this !== heart){
                flag = 1;
            }else if(key != null && this.judge(key) && this !== key){
                flag = 1;
            }else if(GemOrange != null && this.judge(GemOrange) && this !== GemOrange){
                flag = 1;
            }else if(GemGreen != null && this.judge(GemGreen) && this !== GemGreen){
                flag = 1;
            }else if(GemBlue != null && this.judge(GemBlue) && this !== GemBlue){
                flag = 1;
            }
            if(flag){
                this.randomPosition();
            }else{
                break;
            }
        }
    }
    randomPosition(){
        let x = Math.floor(Math.random()*5)*101;
        let y = Math.floor(Math.random()*3 + 1)*83 -20;
        this.x = x;
        this.y = y;
    }
}

var player = new Player();
var allEnemies = new Array();
var Rocks = new Array();
var heart = null;
var key = null;
var GemBlue = null;
var GemGreen = null;
var GemOrange = null;
var round = 1;
var score = 0;
var enemyTimer;
var itemTimer;
var enemySpeed = 0;

function createEnemy() {
    clearTimeout(enemyTimer);
    var enemy = new Enemy(enemySpeed);
    enemy.randomPosition();
    allEnemies.push(enemy);

    var t = Math.round(Math.random() * 1000) + 1000;
    enemyTimer = setTimeout(createEnemy,t-enemySpeed*6);
}
function createRocks() {
    let rocksNum = Math.random() * 3 + 1;
    for(let i = 0 ; i < rocksNum; i++){
        var rock = new Item('images/Rock.png');
        rock.judgePosition();
        rock.setRect();
        Rocks.push(rock);
    }
}
function createItems() {
    var index = Math.floor(Math.random()*50);
    if(index == 0 && heart == null){
        heart = new Item('images/Heart.png');
        heart.judgePosition();
        heart.setRect();
    }else if(index == 10 && key == null){
        key = new Item('images/Key.png');
        key.judgePosition();
        key.setRect();
    }else if(index == 20 && GemBlue == null){
        GemBlue = new Item('images/Gem Blue.png');
        GemBlue.judgePosition();
        GemBlue.setRect();
    }else if(index == 30 && GemGreen == null){
        GemGreen = new Item('images/Gem Green.png');
        GemGreen.judgePosition();
        GemGreen.setRect();
    }else if(index == 49 && GemOrange == null){
        GemOrange = new Item('images/Gem Orange.png');
        GemOrange.judgePosition();
        GemOrange.setRect();
    }
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
function initEnemy() {
    for(let i = 0 ; i < 3; i++){
        var enemy = new Enemy(enemySpeed);
        enemy.randomPosition();
        enemy.x = Math.floor(Math.random()*101*2);
        allEnemies.push(enemy);
    }
}

function initGame() {
    round = 1;
    score = 0;
    player.resetAttr();
    allEnemies = [];
    Rocks = [];
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
        initEnemy();
        itemTimer = setInterval(createItems,1000);
        $('.cover')[0].style.display = 'none';
    });
    $(function () { $("[data-toggle='popover']").popover(); });
}
function initGlobal() {
    allEnemies = [];
    Rocks = [];
    heart = null;
    key = null;
    GemBlue = null;
    GemGreen = null;
    GemOrange = null;
}
function restart() {
    enemySpeed = 0;
    round = 1;
    score = 0;
    player.resetAttr();
    initGlobal();
    setRound();
    setHreat();
    clearTimeout(enemyTimer);
    clearInterval(itemTimer);
    $('.cover')[0].style.display = 'flex';
    var eScore = $('.score')[0];
    eScore.innerHTML = score;
}
function win() {
    initGlobal();
    enemySpeed += 8;
    round++;
    setRound();
    score += 100;
    var eScore = $('.score')[0];
    eScore.innerHTML = score;

    player.x = 101 * 2;
    player.y = 83 * 5 - 10;
    createEnemy();
    createRocks();
    initEnemy();
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
    initGlobal();
    createRocks();
    initEnemy();
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
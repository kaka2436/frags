/**
 * Enemy类，生成敌人，也就是虫子
 * @constructor
 */
class Enemy {
    /**
     * 构造函数
     * @param speed 虫子移动的速度，在每次胜利时，都会增加
     */
    constructor(speed = 0) {
        //x 虫子的x轴坐标点
        this.x = -100;
        //y 虫子的y轴坐标点
        this.y = 0;
        //speed 虫子移动的速度，在每次胜利时，都会增加
        this.speed = 110 + speed;
        //sprite 虫子的图片
        this.sprite = 'images/enemy-bug.png';
        //rect 虫子的中心点坐标及宽高，用于进行碰撞检测
        this.rect = {
            width: 101,
            height: 83,
            centerX: 0,
            centerY: 0,
        };
    }

    /**
     * 此为游戏必须的函数，用来更新敌人的位置
     * 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
     * 都是以同样的速度运行的
     * @param dt 表示时间间隙
     */
    update(dt) {
        this.x += this.speed * dt;
        if (this.x >= 101 * 6) {
            var index = allEnemies.indexOf(this);
            allEnemies.splice(index, 1);
        }
        this.setRect();
    }

    /**
     * 此为游戏必须的函数，用来在屏幕上画出敌人
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /**
     * 每次虫子移动时，进行刷新rect的值
     */
    setRect() {
        this.rect.centerX = Math.ceil(this.x + 101 / 2);
        this.rect.centerY = Math.ceil(this.y + 83 / 2);
    }

    /**
     * 随机虫子的位置
     */
    randomPosition() {
        this.y = Math.floor(Math.random() * 3 + 1) * 83 - 20;
    }
}

/**
 * Player类，用以生成玩家
 * @constructor
 */
class Player {
    /**
     * 构造函数
     */
    constructor() {
        //x 玩家的x轴坐标点
        this.x = 101 * 2;
        //y 玩家的y轴坐标点
        this.y = 83 * 5;
        //sprite 玩家的图片
        this.sprite = 'images/char-boy.png';
        //life 玩家的生命值
        this.life = 5;
        //rect 玩家的中点坐标，用以进行碰撞检测
        this.rect = {
            width: 101,
            height: 83,
            centerX: Math.floor(this.x + 101 / 2),
            centerY: Math.floor(this.y + 83 / 2),
        };
    }

    /**
     * 在玩家移动时，用以进行更新玩家的rect
     */
    setRect() {
        this.rect.centerX = Math.ceil(this.x + 101 / 2);
        this.rect.centerY = Math.ceil(this.y + 83 / 2);
    }

    /**
     * 在玩家移动式，更新玩家的rect，并判断是否跟虫子有碰撞
     */
    update() {
        this.setRect();
        this.judgeEnemy();
    }

    /**
     * 更换玩家图片，换肤功能
     */
    resetFace(url) {
        this.sprite = url;
    }

    /**
     * 初始化玩家的位置、图片、生命信息，用以在游戏重新开始的时候进行调用
     */
    resetAttr() {
        this.x = 101 * 2;
        this.y = 83 * 5 - 10;
        this.life = 5;
        this.sprite = 'images/char-boy.png';
    }

    /**
     * 绘制玩家
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * 处理玩家的键盘事件，在这里会判断用户与石头、特殊道具的碰撞检测，并检测玩家是否成功过河
     * @final 83 玩家上下移动一次的距离
     * @final 101 玩家左右移动一次的距离
     */

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
        //如果与石头发生碰撞，则不移动
        if (this.judgeRocks(x, y)) {
            x = 0;
            y = 0;
        }
        this.x += x;
        this.y += y;
        this.judgeWin();
        this.judgeEffects(x, y);
    }

    /**
     * 判断玩家是否成功过河
     */
    judgeWin() {
        if (this.y < 60) {
            win();
        }
    }

    /**
     * 判断并处理玩家与特殊道具的碰撞，特殊道具包括：红心、钥匙、蓝宝石、绿宝石、橙宝石
     */
    judgeEffects(x, y) {
        if (heart != null && this.collisionDetection(heart.rect, x, y)) {
            if (this.life < 5) {
                this.life++;
            }
            heart = null;
            setHreat();
        } else if (key != null && this.collisionDetection(key.rect, x, y)) {
            key = null;
            win();
        } else if (GemBlue != null && this.collisionDetection(GemBlue.rect, x, y)) {
            GemBlue = null;
            score += 300;
            var eScore = $('.score')[0];
            eScore.innerHTML = score;
        } else if (GemOrange != null && this.collisionDetection(GemOrange.rect, x, y)) {
            GemOrange = null;
            score += 600;
            var eScore = $('.score')[0];
            eScore.innerHTML = score;
        } else if (GemGreen != null && this.collisionDetection(GemGreen.rect, x, y)) {
            GemGreen = null;
            allEnemies = [];
        }
    }

    /**
     * 判断玩家与石头是否会碰撞
     * @param x 因为玩家能否与石头发生碰撞，是将要发生的事情，所以判断时，应该加上一个格子的距离，x为横向距离
     * @param y y为纵向距离
     * @returns {boolean}   发生碰撞则返回true，否则返回false
     */
    judgeRocks(x, y) {
        for (let i = 0; i < Rocks.length; i++) {
            if (this.collisionDetection(Rocks[i].rect, x, y)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断与所有虫子的碰撞
     */
    judgeEnemy() {
        for (let i = 0; i < allEnemies.length; i++) {
            if (this.collisionDetection(allEnemies[i].rect)) {
                dead();
            }
        }
    }

    /**
     * 碰撞检测函数
     * @param rect 判断对象的rect
     * @param x 在判断石头与特殊道具时，都需要判断即将发生的事情，所以判断时，应该加上一个格子的距离，x为横向距离
     * @param y y为纵向距离
     * @returns {boolean} 发生碰撞则返回true，否则返回false
     */
    collisionDetection(rect, x = 0, y = 0) {
        let verticalDistance; //垂直距离
        let horizontalDistance; //水平距离
        verticalDistance = Math.abs(this.rect.centerX + x - rect.centerX);
        horizontalDistance = Math.abs(this.rect.centerY + y - rect.centerY) + 20;

        let verticalThreshold; //两矩形分离的垂直临界值
        let horizontalThreshold; //两矩形分离的水平临界值
        verticalThreshold = (this.rect.height + rect.height) / 2;
        horizontalThreshold = (this.rect.width + rect.height) / 2;

        if (verticalDistance > verticalThreshold || horizontalDistance > horizontalThreshold)
            return false;
        return true;
    }
}

/**
 * 特殊道具类 包含：石头、红心、钥匙、蓝宝石、绿宝石、橙宝石
 * @constructor
 *
 */
class Item {
    /**
     * 构造函数
     * @param sprite 创造不同种类的道具，传入对应的图片资源路径
     */
    constructor(sprite) {
        this.x = 0;
        this.y = 0;
        this.sprite = sprite;
        this.randomPosition();
        this.rect = {
            width: 101,
            height: 83,
            centerX: Math.floor(this.x + 101 / 2),
            centerY: Math.floor(this.y + 83 / 2),
        };
    }

    /**
     * 绘制道具位置
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * 更新道具rect
     */
    setRect() {
        this.rect.centerX = Math.ceil(this.x + 101 / 2);
        this.rect.centerY = Math.ceil(this.y + 83 / 2);
    }

    /**
     * 判断与另一个特殊道具，是否重合
     */
    judge(item) {
        return (this.x == item.x && this.y == item.y) ? true : false;
    }

    /**
     * 判断位置是否与其他所有的特殊道具重合
     */
    judgePosition() {
        while (1) {
            var flag = false;
            for (let i = 0; i < Rocks.length; i++) {
                if (this.judge(Rocks[i])) {
                    flag = true;
                    break;
                }
            }
            if (heart != null && this.judge(heart) && this !== heart) {
                flag = true;
            } else if (key != null && this.judge(key) && this !== key) {
                flag = true;
            } else if (GemOrange != null && this.judge(GemOrange) && this !== GemOrange) {
                flag = true;
            } else if (GemGreen != null && this.judge(GemGreen) && this !== GemGreen) {
                flag = true;
            } else if (GemBlue != null && this.judge(GemBlue) && this !== GemBlue) {
                flag = true;
            }
            if (flag) {
                this.randomPosition();
            } else {
                break;
            }
        }
    }

    /**
     * 随机物品位置
     */
    randomPosition() {
        let x = Math.floor(Math.random() * 5) * 101;
        let y = Math.floor(Math.random() * 3 + 1) * 83 - 20;
        this.x = x;
        this.y = y;
    }
}

/**
 * @global player 玩家对象
 * @global allEnemies 敌人的数组
 * @global Rocks 石头的数组
 * @global heart 红心道具
 * @global key 钥匙道具
 * @global GemBlue 蓝色宝石道具
 * @global GemGreen 绿色宝石道具
 * @global GemOrange 橙色宝石道具
 * @global round 回合数
 * @global score 玩家分数
 * @global enemyTimer 产生敌人的timeout对象
 * @global itemTimer 产生特殊道具的Interval对象
 * @global enemySpeed 敌人速度的加成数，每次游戏胜利，该数值会增加，并加在敌人的速度上，游戏重置则该数值重置
 */
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

/**
 * 产生敌人的函数
 * 因为需要每两次产生敌人的时间剪个不一样，所以采用了setTimeOut,并在该函数中回调自身
 */
function createEnemy() {
    clearTimeout(enemyTimer);
    var enemy = new Enemy(enemySpeed);
    enemy.randomPosition();
    allEnemies.push(enemy);

    var t = Math.round(Math.random() * 1000) + 1000;
    enemyTimer = setTimeout(createEnemy, t - enemySpeed * 6);
}

/**
 * 产生石头的函数
 */
function createRocks() {
    let rocksNum = Math.random() * 3 + 1;
    for (let i = 0; i < rocksNum; i++) {
        var rock = new Item('images/Rock.png');
        rock.judgePosition();
        rock.setRect();
        Rocks.push(rock);
    }
}

/**
 * 产生特殊道具的函数
 */
function createItems() {
    var index = Math.floor(Math.random() * 50);
    if (index == 0 && heart == null) {
        heart = new Item('images/Heart.png');
        heart.judgePosition();
        heart.setRect();
    } else if (index == 10 && key == null) {
        key = new Item('images/Key.png');
        key.judgePosition();
        key.setRect();
    } else if (index == 20 && GemBlue == null) {
        GemBlue = new Item('images/Gem Blue.png');
        GemBlue.judgePosition();
        GemBlue.setRect();
    } else if (index == 30 && GemGreen == null) {
        GemGreen = new Item('images/Gem Green.png');
        GemGreen.judgePosition();
        GemGreen.setRect();
    } else if (index == 49 && GemOrange == null) {
        GemOrange = new Item('images/Gem Orange.png');
        GemOrange.judgePosition();
        GemOrange.setRect();
    }
}

/**
 * 设置界面上的回合数
 */
function setRound() {
    var eround = $(".round")[0];
    eround.innerHTML = round;
}

/**
 * 设置界面上的生命红心数
 */
function setHreat() {
    var life = $('.life')[0];
    $('.life').empty();
    for (let i = 0; i < player.life; i++) {
        var hreat = document.createElement('span');
        hreat.className = 'glyphicon glyphicon-heart';
        life.appendChild(hreat);
    }
}

/**
 * 初始化敌人
 * 新回合开始的时候，随机在界面上产生三个敌人，其余的敌人的起始位置都是在界面的最左端
 */
function initEnemy() {
    for (let i = 0; i < 3; i++) {
        var enemy = new Enemy(enemySpeed);
        enemy.randomPosition();
        enemy.x = Math.floor(Math.random() * 101 * 2);
        allEnemies.push(enemy);
    }
}

/**
 * 初始化游戏
 * 在页面加在时调用
 * 设置界面元素并绑定事件
 */
function initGame() {
    round = 1;
    score = 0;
    player.resetAttr();
    allEnemies = [];
    Rocks = [];
    initInterFace();
}

/**
 * 初始化界面元素并绑定事件
 */
function initInterFace() {
    setRound();
    setHreat();
    var eScore = $('.score')[0];
    eScore.innerHTML = score;
    $('.restart').click(function() {
        restart();
    });
    $('li.player-face').click(function() {
        player.resetFace($(this).find('img').attr('src'));
    });
    $('.btn-start').click(function() {
        createEnemy();
        createRocks();
        initEnemy();
        itemTimer = setInterval(createItems, 1000);
        $('.cover')[0].style.display = 'none';
    });
    $(function() {
        $("[data-toggle='popover']").popover();
    });
}

/**
 * 初始化部分每次回合开始时需要重置的全局变量
 */
function initGlobal() {
    allEnemies = [];
    Rocks = [];
    heart = null;
    key = null;
    GemBlue = null;
    GemGreen = null;
    GemOrange = null;
}

/**
 * 重新开始游戏的函数
 */
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

/**
 * 当玩家成功过河时调用
 */
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

/**
 * 当玩家在游戏中死亡时调用
 */
function dead() {
    player.life--;
    if (player.life <= 0) {
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

/**
 * 当玩家生命值耗尽时调用
 */
function defeated() {
    $('.message')[0].innerHTML = `<p>前路漫漫</p><p>难免会有坎坷</p><p>收拾行装</p><p>重新上路</p>`;
    $('.btn-start')[0].innerHTML = '重新开始';
    restart();
}

//这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
//方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
$(document).ready(function() {
    initGame();
});
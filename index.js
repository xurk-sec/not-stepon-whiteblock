window.onload = function() {
  presentScore();
}


// 封装函数
function $(id) {
  return document.getElementById(id);
}

// 全局变量声明
var SPACE = {};

SPACE.clock = null,
SPACE.state = 0;
SPACE.speed = 6,
SPACE.flag = false;
SPACE.scores = [0, 0, 0];


// 开始游戏
function start() {
  console.log('start');
  if(!SPACE.flag) {
    init();
  } else {
    alert('游戏已开始！');
  }
}

// 初始化游戏
function init() {
  SPACE.flag = true;

  for (let i = 0; i < 4; i++) { //初始化建四行块
    createrow();
  }

  $('main').onclick = function (ev) { // ev为MouseEvent Object
    ev = ev || event;
    judge(ev);
  }

  SPACE.clock = window.setInterval('move()', 30);
}

// 判断是否点击黑块、白块
function judge(ev) {
  // 查看类名是否存在black字符串和cell字符串 点击了cell 但未点击black
  if (  ev.target.className.indexOf('black') == -1 && 
        ev.target.className.indexOf('cell') !== -1 
      ) {
    ev.target.parentNode.pass1 = 1; // 定义属性pass，表示此行row的白块已经被点击
  }

  if (ev.target.className.indexOf('black') !== -1) {
    ev.target.className = 'cell';
    ev.target.parentNode.pass = 1;  // 定义属性pass1，表示此行row的黑块已被点击
    score();
  }
}

function score() {
  var newscore = parseInt($('score').innerHTML) + 1;  // 分数加一
  $('score').innerHTML = newscore;
  if (newscore % 10 == 0) { // 当分数为10的倍数时，调用加速函数，加速方块下落的速度
    speedup();
  }
}

// 新建一行块
function createrow() {
  var con = $('con');   //CSS选择器
  var row = creatediv('row'); // 获取一个class值为row的div节点
  var arr = creatcell();  // 获得一个四个class值的数组

  con.appendChild(row);   // ？？？
  for (let i = 0; i < 4; i++){
    row.appendChild(creatediv(arr[i]));
  }

  if (con.firstChild == null) {  // 也就是说新append上去的div是仅存的了
    con.appendChild(row); // 新append上去的div是空的，把格子也填上去
  } else {
    con.insertBefore(row, con.firstChild);
  }

}

// 删除行
function delrow() {
  var con = $('con');
  if (con.childNodes.length == 7) { 
    con.removeChild(con.lastChild);
  }
}

// 创建div元素
function creatediv(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

// 新建一行的数组（包含一个cell black）
function creatcell(){
  var temp = ['cell', 'cell', 'cell', 'cell'];
  var i = Math.floor(Math.random()*4);
  temp[i] = 'cell black';
  return temp;
}

// 下落移动
function move() {
  var con = $('con');
  var top = parseInt(window.getComputedStyle(con, null)['top']);

  if (SPACE.speed + top > 0) {
    top = 0;    // 岂不是还要被回拉2px
  } else {
    top += SPACE.speed;
  }

  con.style.top = top + 'px';

  over(); // 未点击的一行完全落完后才算over，此时恰好生成新的一行，共6行

  console.log(top)
  if (top == 0) {
    createrow();
    con.style.top = '-102px';
    delrow();     // 六行的时候要让over判断到，所以这里七行再删除最下面一行
  }
}

// 游戏加速
function speedup(){
  SPACE.speed += 2;
  if (SPACE.speed == 20){
    alert('God like!')
  }
}

// 判断游戏是否结束
function over() {
  var con = $('con');
  var rows = con.childNodes;
  if(rows.length == 6 && rows[rows.length - 1].pass != 1) { // 共有五行，并且第五行黑块未被点击
    fail();
  }
  // for (let i = 0; i < rows.length - 1; i++) {
  //   if (rows[i].pass1 == 1) { // 有白块被点击即失败
  //     fail();
  //   }
  // }
}

// 游戏结束
function fail() {
  clearInterval(SPACE.clock); // 取消这个由setinterval创建的对象
  SPACE.flag = false;
  window.confirm('你的最终得分为：' + parseInt($('score').innerHTML));

  // 更新scores数组


  var con = $('con');
  con.innerHTML = '';

  $('score').innerHTML = 0;
  con.style.top = '-408px';
}

function presentScore(){
  for (let i = 0; i < 3; i++) {
    console.log('i:'+i);
    let p = document.createElement('p');
    p.innerHTML = (i+1) + ': ' + SPACE.scores[i];
    $('ranking').appendChild(p);
  }
}

function updatescore(s) {
  for (let i = 2; i > -1; i++) {
    if(s > SPACE.scores[i]) {
      s ^= SPACE.scores[i]; // 交换值
    } else {
      return;
    }
  }
}

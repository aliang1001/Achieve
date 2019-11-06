// 实现chunk
function chunk(arr, size = 0) {
  let current = 0;
  let temp = [];
  return arr.reduce(
    (acc, cur, i) =>
      temp.push(...(current++ < size ? [cur] : [])) === size ||
      i === arr.length - 1
        ? [...acc, temp, ...((current = 0), (temp = []), [])]
        : acc,
    []
  );
}

//实现compact
function compact(array){
  if(!array || !Array.isArray(array) || array.length<=0){
      return [];
  }

  return array.filter(function (value){
      if(value) return value;
  });

}

// concat实现
function concat(array){
  if(!array || !Array.isArray(array)|| array.length<=0){
      return [];
  }
  if(arguments.length<=1){
      return array.concat();
  }else{
      var args=Array.from(arguments);
      var arg= args.splice(1,1);
      args[0]=array.concat(arg);
      return concat.apply(this,args);
  }
}

//实现unzip
function unzip(arrs) {
  return arrs.reduce((acc, arr) => {
    arr.forEach((item, index) => {
      acc[index] = acc[index] || [];
      acc[index].push(item)
    })
    return acc
  }, [])
}
//drop
function drop(array, n) {
  //深入贯彻函数式编程
  return array.join('').substring(n,).split('').map(v => Number(v))
}
drop([1,2,3], 1) // [2,3]

// 实现new 
    //思路：
    // 1.创建一个空对象
    // 2.空对象的__proto__指向构造函数
    // 3.绑定构造函数的this，期指向实力化对象
    // 4.return 实例化对象

const New = function(P){
    let obj = {} //  #1 
    let arg = Array.prototype.slice.call(arguments,1)  // 构造函数的参数
    obj.__proto__ = P.prototype;  // #2
    P.prototype.constructor = P;   
    P.apply(obj,arg) // #3
    return obj // #4
}    

// let ary = [0]  
// ary instanceof Array   =>    true
// 思路:  instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型是否在该类型的prototype上
const instanceof = function(left,right){
    let protptype = right.protptype
    while(true){
        if(left == null){
            return false
        }
        if(left === protptype){
            return true
        }
        left = left.__proto__
    }
}


// call的实现
// 思路： 1. 如果call中没有参数,那么this指向的就是window
//       2. 将函数当作参数(对象obj)的一个属性
//       3. 执行这个函数
//       4. 删除这个函数
    Function.prototype.call = function(obj,...args){
        let obj = obj || window  //#1   如果没有obj，也就是参数是null,那么this就应该指向window
        obj.fn = this //#2 将函数设为对象的属性 
        let result = obj.fn(...args) //# 执行这个函数
        delete obj.fn //#4 删除这个属性
        return result
    }
    

// apply 实现
// 思路：其实跟call一样，只不过需要判断第二个参数是否是数组

    Function.prototype.apply = function(context){
        var context = context || window
        context.fn = this  // this.也就是调用apply的函数
        var result
        if(arguments[1]){   // 是否有第二个参数
          result = context.fn(...arguments[1])  //如果第二个参数是数组，那么就可以展开，如果不是数组，那就报错！
        } else {
          result = context.fn()
        }
        delete context.fn()
        return result
      }



// bind的实现
//    思路： 1.调用bind的对象，必须是函数，不然报错
//          2.因为bind的特性，是一个闭包，所以this会丢失，只能通过变量保存起来,也就是that
    Function.prototype.bind = function(content,...args){    
        if(Object.prototype.toString.call(this) !== '[object Function]'){
            throw new TypeError(this + 'must be a function')
        }
        let that = this
        return function(...args1){
            return that.apply(content,[...args,...args1])
        }
    }


* 判断数字类型
Object.prototype.toString.call(val) == '[Object Number]'
Object.prototype.toString.call(val) == '[Object Array]'
Object.prototype.toString.call(val) == '[Object Object]'

function isType(type){
  return function(val){   
    return Object.prototype.toString.call(val) === '[object ' + type + ']'
  }
}    

// 浅复制 
function isPrimitive(val){  // 检测val是否是原始类型 
    // 其实不是很想写.... 反正就是Object.prototype.call(val) !== xxxx  那一套。。。。
}
function clone(val){   
  if(isPrimitive(val)){   // 如果val是原始类型那么就返回
    return val
  }
  if(Array.isArray(val)){ // 如果是数组
    var result = []
  } else {   // 如果是对象
    var result = {}
  }
  for(var key in val){
    result[key] = val[key] //让这新对象的各个属性指向val遍历的属性
  }
  return result
}  

//深复制
function isPrimitive(val){
     // 其实不是很想写.... 反正就是Object.prototype.call(val) !== xxxx  那一套。。。。
}

function clone(val){   //
  if(isPrimitive(val)){
    return val
  } 
  if(Array.isArray(val)){
    var result = []
  } else {
    var result = {}
  }
  for(var key in val){
    result[key] = clone(val[key]) //让这新对象的各个属性指向val遍历的属性
  }
  return result
}  


//带环的拷贝,也就是如有循环依赖的情况
var oldTraversed = []
var newTraversed = []
// 因为要返回一个新的引用对象，所以一个数组用来保存新的值，另外一个数组用来检测。
function cloneDeep(obj){
  var index = oldTraversed.indexOf(obj)
  if(index === -1){
    oldTraversed.push(obj)
  } else {
    return newTraversed[index]  //在递归到环的首部之前，返回result的值。
  }
  var result = {}
  newTraversed.push(result)
  for(var key in obj){
    if(typeof obj[key] === 'object'){
      result[key] = cloneDeep(obj[key])
    } else {
      result[key] = obj[key]
    }
  }
  return result
}





// 柯立化 curry函数的实现 
  function curry( f , n = f.length){ //第一个参数接收一个柯立化的函数，第二个参数是,需要接收多少个行参才能返回原函数的结果
    return function(...args){  
      if(args.length >= n){// 如果参数足够的话，那么就调用原函数
          return f(...args)
      } else {
          return curry(f.bind(null,...args), n - args.length) //如果参数不足够的话，那么就绑定f函数的参数,继续柯立化
      }
    }
  }
  //  curry(a,b,c,d){return a+b+c+d}
  //  该函数递归的是函数，返回的也是函数，所以可以curry(a)(b)(c)(d)


// map的实现  
//   思路： 用for循环，因为这样能够暴露下标,在把迭代的值当作该函数的参数调用
Array.prototype.map1 = function(f){
    if(Object.prototype.toString.call(this) !== "[object Array]"){
        throw TypeError(this + 'must be a Array')
    }
    let temp = []
    for(let i = 0 ; i < this.length; i++){
        f(this[i],i)
        temp.push(f)
    }
    return temp
}

// filter的实现
// 思路：跟map其实没多大区别，只不过多了一个校验而已
Array.prototype.filter = function(f){
    if(Object.prototype.toString.call(this) !== "[object Array]"){
        throw TypeError(this + 'must be a Array')
    }
    let temp = []
    for(let i = 0 ; i < this.length; i++){
        f(this[i],i)&&temp.push(this[i])
    }
    return temp
}

// reduce的实现
// 实例：  
// var arr=[2,4,6,8];
// let result=arr.reduce(function (val,item,index,origin) {
//     return val+item
// },0);
// console.log(result) //20

Array.prototype.reduce = function (reducer,initVal) {
    for(let i=0;i<this.length;i++){
        initVal =reducer(initVal,this[i],i,this);
    }
    return initVal
};

// reduce实现map
Array.prototype._map = function(fn,callback){
    //最终返回的新数组
    let result = [];
    //定义回调函数的执行环境
    //call第一个参数传入null,则this指向全局
    let CBthis = callback || null
    result.push(fn.call(CBthis,after,idx,arr),null)
    return result
}

// keyBy的实现
keyBy: function(collection,iteratee = rubick1.iteratee) {
    iteratee = rubick1.iteratee(iteratee)
    collection = Object.entries(collection)
    var result = {}
    for(let i = 0;i < collection.length;i++) {
      value = iteratee(collection[i][1])
      result[value] = collection[i][1]
    }
    return result
  }
  
  //先排后面的，再排前面的,前面的权重大
  //orderBy和sortBy的区别在于orderBy可以指定每次排序是升序还是降序，sortBy只能升序ascending order
  orderBy: function(collection,iteratee = [rubick1.identity],orders =[]){
    //交换collection中两个下标的属性值
    function swap(collection,i,j) {
      var temp = collection[i]
      collection[i] = collection[j]
      collection[j] = temp 
    }
    var newCollection = Object.entries(collection)
    var iters = iteratee.map(x => rubick1.iteratee(x))
    for(let i = iters.length - 1;i >= 0;i--) {
      var iter = iters[i]
      //冒泡需要两层循环！！
      for(let j = newCollection.length - 1;j >= 0;j--) {
        for (let k = 0; k < j;k++) {
          if(orders[i] == "desc") {
            if(iter(newCollection[k][1]) < iter(newCollection[k+1][1])) {
              swap(newCollection,k,k+1)
            } 
          } else {
            if(iter(newCollection[k][1]) > iter(newCollection[k+1][1])) {
              swap(newCollection,k,k+1)
            }
          }
        }
        
      }
    }
    return newCollection.reduce(function(result,item){
      result.push(item[1])
      return result
    },[])
  },

//   partition的实现
  partition: function(collection,predicate = rubick1.identity) {
    predicate = rubick1.iteratee(predicate)
    var result = [[],[]]
    collection.forEach(item => predicate(item)? result[0].push(item) : result[1].push(item))
    return result
  },

//reduceRight的实现
  reduceRight: function(collection,iteratee = rubick1.identity,accumulator) {
    iteratee = rubick1.iteratee(iteratee)
    var flag = false
    if(rubick1.isArray(collection)) {
      flag = true
    }
    originalCollection = collection
    collection = Object.entries(collection)
    var i = collection.length - 1
    if(accumulator == undefined) {
      accumulator = collection[i][1]
      i--
    }
    for(;i >= 0;i--) {
      if(flag) {
        accumulator = iteratee(accumulator,collection[i][1],Number(collection[i][0]),originalCollection)
      } else {
        accumulator = iteratee(accumulator,collection[i][1],collection[i][0],originalCollection)
      }     
    }
    return accumulator
  }
// reject的实现
  reject: function(collection,predicate = rubick1.identity) {
    predicate = rubick1.iteratee(predicate)
    var result = []
    collection.forEach(function(item,idx,collection){
      if(!predicate(item,idx,collection)) {
        result.push(item)
      }
    })
    return result
  }
//sample的实现
  sample: function(collection) {
    collection = Object.entries(collection)
    return collection[Math.floor(Math.random() * collection.length)][1]
  },

  sampleSize: function(collection,num = 1) {
    return rubick1.shuffle(collection).slice(0,num)
  },

  shuffle: function(collection) {
    var result = []
    collection = Object.entries(collection)
    var rangeNumber = collection.length
    var length = collection.length
    for(let i = 0;i < length;i++) {
      var idx = Math.floor(Math.random()* rangeNumber)
      result.unshift(collection[idx][1])
      collection.splice(idx,1)
      rangeNumber--
    }
    return result
  }

// debounce的实现
  function debounce(f,deration){
    var id 
    return function(...args){
      clearTimeout(id)
      id = setTimeout(()=>{
        f.apply(this,args)
      },deration)
    }
  }
//每次触发这个事件的时候，会触发debounce函数，这个函数里边有一个异步执行的计时器，只有等待计时器到时间后才能触发所期待的函数，如果在计时器还未到时间的阶段再次触发这个函数，那么会消除上一个计时器，重新及时。

// throttle的实现
  function throttle(f,duration){
    var lastTime = 0;
    return function(){
      var now = Date.now()
      if(now - lastTime > duration){
        f()
      }
      lastTime = now
    }
  }

// get请求封装
  function get(url,callback,errCallback){
    let xhr = new XMLHttpRequest()
    xhr.open('GET',url)
    xhr.addEventListener('load',()=>{
      callback(xhr.responseText)
    })
    xhr.addEventListener('error',(e)=>{
      callback(e)
    })
    xhr.send()
  }

// ajax封装
  ajax('foo.json',{
    method:'get',
    headers:{
      "Content-Type": 'application/json',
      "X-Requsted-By": 'ajax helper function',
    },
    data:'xxxxx',
    success: function(data){},
    error: function(error){},
  })
  function ajax(url,option) {
    let xhr = new XMLHttpRequest()
    xhr.open(option.method,url)
    if(option.headers){
      for(var key in headers){
        let val = option.headers[key]
        xhr.setRequestHeader(key,val)
      }
    }
    xhr.addEventListener('load',function(){
      options.success(xhr.responseText)
    })
    xhr.addEventListener('error',function(e){
      options.error(e)
    })
    xhr.send(options.data)
  } 

// Jspnp
// Jsonp 声明一个函数作为载体，内容通过参数的形式传入相应给页面
function jsonp(url,callback,errCallback,timeoutCallback){
  var callbackName = 'JSONP_CALLBACK_' + Date.now() + '_' + Math.random() .toString()  // 设定一个随机的字符串
   window[callbackName] = callback  // 设定一个全局的函数作为载体
   url = url + '&callback=' + callbackName
   var script = document.createElement('script')
   script.src = url
   script.onload = function(){
     if(!runned){
       document.body.removeChild(script)
       delete window[callbackName]
       runned = true
     }
   }
    script.onerror = function(e){
      if(!runned){
        errCallback(e)
        runned = true
      }
    }
     setTimeout(()=>{
        if(!runned){
          timeoutCallback()
          runned = true
        }
     },10000)
   document.head.appendChild(script)
}


// Generator的实现

// 使用 * 表示这是一个 Generator 函数
// 内部可以通过 yield 暂停代码
// 通过调用 next 恢复执行
function* test() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}
let b = test();
console.log(b.next()); // >  { value: 2, done: false }
console.log(b.next()); // >  { value: 3, done: false }
console.log(b.next()); // >  { value: undefined, done: true }

// cb 也就是编译过的 test 函数
function generator(cb) {
  return (function() {
    var object = {
      next: 0,
      stop: function() {}
    };

    return {
      next: function() {
        var ret = cb(object);
        if (ret === undefined) return { value: undefined, done: true };
        return {
          value: ret,
          done: false
        };
      }
    };
  })();
}
// 如果你使用 babel 编译后可以发现 test 函数变成了这样
function test() {
  var a;
  return generator(function(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        // 可以发现通过 yield 将代码分割成几块
        // 每次执行 next 函数就执行一块代码
        // 并且表明下次需要执行哪块代码
        case 0:
          a = 1 + 2;
          _context.next = 4;
          return 2;
        case 4:
          _context.next = 6;
          return 3;
		// 执行完毕
        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}


// 简介版Promise
思路：
1.promise的链式调用，实际上就是then返回另外一个promise
2.延迟触发then函数,通过把两种情况的调用函数结果保存起来，校验Promise函数体中,resolve还是reject，来触发成功函数or失败函数
3.then的return值，会当中promise resolve的值作为下次链式调用

class Promise{
  constructor(executor){ //executor是个函数, (resolve,reject)=>{}
      this.states = 'pending'  //一开始默认状态是'pending'
      this.value = null        // 成功的值
      this.reason = null       //失败的值
      this.onResolvedCallbacks = []  //保存延迟触发resolve函数的数组
      this.onRejectedCallbacks = []  //保存延迟触发reject函数的数组
      let resolve = value=>{
          if(this.states === 'pending'){   
               this.states = 'resolve'    //只要状态由'pending'转变到resolve，那么就把该函数储存数组相继触发
               this.value = value
               this.onResolvedCallbacks.forEach(fn=>fn())
          }
      }
      let reject = error=>{
          if(this.states === 'pending'){ //只要状态由'pending'转变到reject，那么就把该函数储存数组相继触发
              this.states = 'reject'
              this.reason = error
              this.onRejectedCallbacks.forEach(fn=>fn())
          }
      }
      try{
          executor(resolve,reject)   //这个错误，必须通过try抛出来
      } catch(e){
          reject(e)
      }
  }
  then(onFufilled,onRejected){ 
      if(typeof onFufilled !== 'function'){  //如果then第一个参数不是函数，那么其成功的值作为这次promise的值
           onFufilled = function(value){
               return value
           }
      }
     let promise2 = new Promise((resolve,reject)=>{
         if(this.states ==='pending'){
             this.onRejectedCallbacks.push(()=>{  // 保存延迟触发函数
               const x = onRejected(this.reason)
               resolve(x)
             })
             this.onResolvedCallbacks.push(()=>{  // 保存延迟触发函数
               const x = onFufilled(this.value)
               reject(x)
             })
         }
         if(this.states === 'resolve'){
           const x = onFufilled(this.value)
           resolve(x)
         }
         if(this.states === 'reject'){
           const x = onRejected(this.reason)
             resolve(x)
         }
      })
     }
}


// 生成器改善异步逻辑的原理 co
// 由TJ写的co库

  function get(value){
    return new Promise((resolve,reject)=>{
      setTimeout(()=> resolve(value),2000+3000 * Math.random())
    })
  } //新建一个随机时间固定状态的以value为值的Promise对象
  
run(function *(){
  var a = yield get(5) 
  console.log(a)
  var b = yield get(6)
  console.log(b)
}).then(()=>console.log('done'))

function run(f){
  return new Promise((resolve,reject)=>{  //注意，一定要return
    var iterable = f()
    var generated = iterable.next()  // 第一步先生成一个yield所对应的promise对象

    done() //启动函数开始搞事情

    function done(){  
      if(generated.done){
        resolve(generated.value)
      } else {
        generated.value.then(val=>{  // 拿到promise对象
            generated = iterable.next(val)   // 返回成功的值传参赋值给这一轮yield的表达式，成立var的赋值
            done() //再次调用这个函数，拿到下一轮yeild指向的表达式做文章
        },reason=>{
            generated = iterable.throw(reason)
            done()
        })    
      }
    }
  })
}

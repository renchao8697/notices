### Stack（栈）

![stack](./images/stack.png)
`Stack`的特点是后进先出（last in first out）。比如弹夹，后装入的子弹会先发射出去；又比如浏览器的访问历史，当我们点击返回按钮时，最后访问的网站最先从历史记录中弹出。
Stack一般具有以下方法：
* push：将一个元素推入栈顶
* pop：移除栈顶元素，并返回被移除的元素
* peek：返回栈顶元素
* size：返回栈中元素个数
  
`Javascript`的`Array`天生具备了`Stack`的特性，下面我们手动实现一个`Stack`类：
```js
class Stack {
  constructor() {
    this.size = 0;
    this.storage = {};
  }
  push(value) {
    this.storage[this.size] = value;
    this.size++;
  }
  pop() {
    if (this.size === 0) {
      return undefined;
    }
    this.size--;
    const result = this.storage[this.size];
    delete this.storage[this.size];
    return result;
  }
  peek() {
    return this.storage[this.size - 1];
  }
}
```

### Queue(队列)

![queue](./images/queue.png)
Queue和Stack有一些类似，不同的是Stack是先进后出，而Queue是先进先出。Queue最常见的例子就是排队上车，排在第一个的总是最先上车。
Queue一般具有以下方法：
* enqueue：入列，想队列尾部增加一个元素
* dequeue：出列，移除队列头部的一个元素并返回被移除的元素
* front：获取队列的第一个元素
* isEmpty：判断队列是否为空
* size：获取队列中元素的个数

Javascript中的Array已经具备Queue的一些特性，下面借助Array实现一个Queue：
```js
class Queue {
  constructor() {
    this.collection = [];
    this.size = this.collection.length;
    this.isEmpty = true;
  }
  enqueue(element) {
    this.collection.push(element);
    this.size = this.collection.length;
    this.isEmpty = (this.size === 0);
  }
  dequeue() {
    const result = this.collection.shift();
    this.size = this.collection.length;
    this.isEmpty = (this.size === 0);
    return result;
  }
  front() {
    return this.collection[0];
  }
  print() {
    console.log(this.collection);
  }
}
```

#### Priority Queue(优先队列)
Queue还有一个升级版本，给每个元素赋予优先级，优先级高的元素入列时排到低优先级之前。区别主要是enqueue方法的实现：
```js
class PriorityQueue extends Queue {
  enqueue(element) {
    if (this.isEmpty) {
      this.collection.push(element);
    } else {
      let index = this.collection.findIndex(ele => ele[1] > element[1]);
      if (!~index) {
        this.collection.push(element);
      } else {
        this.collection.splice(index, 0, element)
      }
    }
    this.size = this.collection.length;
    this.isEmpty = (this.size === 0);
  }
}

let pQ = new PriorityQueue();
pQ.enqueue(['gannicus', 3]);
pQ.enqueue(['spartacus', 1]);
pQ.enqueue(['spartacus111', 1]);
pQ.enqueue(['crixus', 2]);
pQ.enqueue(['oenomaus', 4]);
```
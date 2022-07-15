# JS实现常见的数据结构

## Stack（栈）

![stack](/images/javascript/stack.png)

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

## Queue(队列)

![queue](/images/javascript/queue.png)

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

### Priority Queue(优先队列)

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

## Linked List(链表)

![linked_list](/images/javascript/linked_list.png)

链表是一种链式数据结构，链上上的每个节点包含两种信息：节点本身的数据和指向下一个节点的指针。链表和传统的数组都是线性的数据结构，存储的都是一个序列的数据，但也有很多区别，如下表

| 比较维度 | 数组 | 链表 |
|:------:|:------:|:------:|
| 内存分配 | 静态内存分配，编译时分配且连续 | 动态内存分配，运行时分配且不连续 |
| 元素获取 | 通过inde获取，速度较快 | 通过遍历顺序访问，速度较慢 |
| 添加删除元素 | 内存位置连续切固定，速度较慢 | 内存分配灵活，只有一个开销步骤，速度更快 |
| 空间结构 | 可以是一维或者多维数组 | 可以是单向、双向或循环链表 |

一个单向链表通常具有以下方法：
* size：链表中节点的个数
* head：链表中的头部元素
* add：项链表尾部增加一个节点
* remove：删除某个节点
* indexOf：返回某个节点的index
* elementAt：返回某个index处的节点
* addAt：在某个index处插入一个节点
* removeAt：删除某个index处的节点

```js
class Node {
  constructor(element) {
    this.node = element;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
  }
  add(element) {
    let node = new Node(element);
    if (this.head === null) {
      this.head = node;
    } else {
      let curNode = this.head;
      while (curNode.next) {
        curNode = curNode.next;
      }
      curNode.next = node;
    }

    this.size++;
  }
  addAt(index, element) {
    if (index < 0 || index  > this.size) {
      return null;
    } else if (index === this.size) {
      this.add(element);
    } else {
      let node = new Node(element)
      let curNode = this.head;
      if (index === 0) {
        [this.head, this.head.next] = [node, curNode]
      } else {
        let i = 1;
        let prevNode = curNode;
        curNode = curNode.next;
        while(i < index) {
          [prevNode, curNode] = [curNode, curNode.next]
          i++;
        }
        prevNode.next = node;
        node.next = curNode
      }
      this.size++;
    }
  }
  remove(element) {
    let prevNode = null;
    let curNode = this.head;
    if (curNode.node === element) {
      this.head = curNode.next;
      this.size--;
    } else {
      while(curNode && curNode.node !== element) {
        [prevNode, curNode] = [curNode, curNode.next]
      }
      if (curNode) {
        prevNode.next = curNode.next;
        this.size--;
      }
    }
  }
  removeAt(index) {
    if (index < 0 || index > this.size) {
      return null;
    }
    let curNode = this.head;
    if (index === 0) {
      this.head = curNode.next
    } else {
      let i = 1;
      let prevNode = curNode;
      curNode = curNode.next;
      while(i < index) {
        i++;
        [prevNode, curNode] = [curNode, curNode.next]
      }
      prevNode.next = curNode.next
    }
    this.size--;
    return curNode.node
  }
  indexOf(element) {
    let [curNode, i] = [this.head, 0];
    while(curNode && curNode.node !== element) {
      curNode = curNode.next;
      i++;
    }
    return curNode ? i : -1;
  }
  elementAt(index) {
    if (index < 0 || index >= this.size) {
      return null;
    }
    let curNode = this.head;
    let i = 0;
    while(i < index) {
      curNode = curNode.next;
      i++;
    }
    return curNode.node;
  }
  print() {
    let curNode = this.head;
    let linkedList = [curNode.node];
    while (curNode.next) {
      linkedList.push(curNode.next.node);
      curNode = curNode.next;
    }
    console.log(linkedList.join('==>'));
  }
}
```

## Set(集合)

![set](/images/javascript/set.png)

集合是数学中的一个基本概念，表示具有某种特性的对象汇总成的集体。在ES6中也引入了集合类型`Set`,`Set`和`Array`有一定程度的相似，不同的是`Set`中不允许出现重复的元素而且是无序的。
一个典型的`Set`应该具有以下方法：
* values：返回集合中的所有元素
* size：返回集合中元素的个数
* has：判断集合中是否存在某个元素
* add：向集合中添加元素
* remove：从集合中移除某个元素
* union：返回两个集合的并集
* intersection：返回两个集合的交集
* difference：返回两个集合的差集
* subset：判断一个集合是否为另一个集合的子集

## Hash Table(哈希表/散列表)

![hash_table](/images/javascript/hash_table.png)

Hash Table是一种用于存储键值对（key value pair）的数据结构，因为Hash Table根据key查询value的速度很快，所以它常用于实现Map、Dictionary、Object等数据结构。如上图所示，Hash Table内部使用一个hash函数将传入的键转换成一串数字，而这串数字将作为键值对实际的key，通过这个key查询对应的value非常快，时间复杂度将达到O(1)。Hash函数要求相同输入对应的输出必须相等，而不同输入对应的输出必须不等，相当于对每对数据打上唯一的指纹。

一个Hash Table通常具有下列方法：
* add：增加一组键值对
* remove：删除一组键值对
* lookup：查找你哥键对应的值
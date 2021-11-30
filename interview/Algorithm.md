#### 两数之和
*LeetCode1 Easy*
*Tags: array | hash-table*

给定一个整数数组`nums`和一个整数目标值`target`，请你在该数组中找出**和为目标值**`target`的那**两个**整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
你可以按任意顺序返回答案。

```
示例1：
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1]

示例2：
输入：nums = [3,2,4], target = 6
输出：[1,2]

示例3：
输入：nums = [3,3], target = 6
输出：[0,1]
```


答案1：暴力枚举
**思路**
枚举数组中的每一个数`x`，寻找数组中是否存在`target-x`；双层循环，第一层循环取`x`，第二层循环在数组中找`target-x`，第二次循环只需要找x之后的元素就可以了。
```js 
const twoSum = (nums, target) => {
    for(let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};
```
* 时间复杂度：O($N^{2}$)
* 空间复杂度：O(1)

答案2：哈希表
**思路**
创建一个哈希表，对于每一个x，首先查询哈希表中是否存在target-x，存在即得到答案，不存在则继续遍历。
```js 
const twoSum = (nums, target) => {
    let cache = {};
    for(let i = 0; i < nums.length; i++) {
        if ((target - nums[i]) in cache) {
            return [cache[target - nums[i]], i];
        } else {
            cache[nums[i]] = i;
        }
    }
};
```
* 时间复杂度：O(N)
* 空间复杂度：O(N)

#### 斐波那契数
*LeetCode509 Easy*
*Tags: tree*

斐波那契数，通常用`F(n)`表示，形成的序列称为**斐波那契数列**。该数列由`0`和`1`开始，后面的每一项数字都是前面两项数字的和。也就是：
> F(0) = 0，F(1) = 1
> 
> F(n) = F(n - 1) + F(n - 2)，其中 n > 1

给你`n`，请计算`F(n)`。

```
示例1：
输入：2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1

示例2：
输入：3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2

示例3：
输入：4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```

答案1：递归
```js
const fib = n => n <= 1 ? n : fib(n - 1) + fib(n - 2);
```

答案2：递推
```js
const fib = (n) => {
    let arr = [];
    for (let i = 0; i <= n; i++) {
        if (i <= 1) {
            arr.push(i);
        } else {
            arr.push(arr[i - 1] + arr[i - 2]);
        }
    }
    return arr.pop();
}
```
* 时间复杂度：O(n)
* 空间复杂度：O(n)

答案2：动态规划
**思路**
斐波那契数的边界条件是`F(0)=0`和`F(1)=1`。当`n>1`时每一项的和都是等于前两项的和，因此有如下递推关系：`F(n)=F(n-1)+F(n-2)`
由于斐波那契数存在递推关系，因此可以使用动态规划求解。动态规划的状态转移方程即为上述递推关系，边界条件`F(0)`和`F(1)`。
根据状态转移方程和边界条件，可以得到时间复杂度和空间复杂度都是`O(n)`的实现。由于`F(n)`只和`F(n-1)`与`F(n-2)`有关，因此可以使用【滚动数组思想】把空间复杂度优化成`O(1)`。

```js
const fib = (n) => {
    if (n <= 1) {
        return n;
    }
    let [p, q, r] = [0, 0, 1];
    for (let i = 2; i <= n; i++) {
        [p, q, r] = [q, r, q + r];
    }
    return r;
}
```
* 时间复杂度：O(n)
* 空间复杂度：O(1)

#### 有效的括号
*LeetCode20 Easy*
*Tags: string | stack*

给定一个只包括`'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串`s`，判断字符串是否有效。

有效字符串需满足：
左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

```
示例1：
输入：s = "()"
输出：true

示例2：
输入：s = "()[]{}"
输出：true

示例 3：
输入：s = "(]"
输出：false

示例 4：
输入：s = "([)]"
输出：false

示例 5：
输入：s = "{[]}"
输出：true
```

答案：栈
**思路**
判断括号的有效性可以使用【栈】这一数据结构来解决。
遍历给定的字符串`s`。当遇到一个左括号时，我们会期望在后续的遍历中，有一个相同类型的右括号将其闭合。由于**后遇到的左括号要先闭合**，因此我们可以将这个左括号放入栈顶。
当我们遇到一个右括号时，我们需要将一个相同类型的左括号闭合。此时，我们可以取出栈顶的左括号并判断它们是否是相同类型的括号。如果不是相同的类型，或者栈中并没有左括号，那么字符串`s`无效，返回`false`。为了快速判断括号的类型，我们可以使用哈希表存储每一种括号的对应关系。
在遍历结束后，如果栈不为空，返回`false`，否则返回`true`。
遍历前，可以先判断`s`的长度是否为偶数，如果长度是奇数，则直接返回`false`。

```js
const isValid = (s) => {
    if (s.length % 2) {
        return false;
    }
    let stack = [];
    let map = new Map([['(', ')'], ['[', ']'], ['{', '}']]);
    for (let i = 0; i < s.length; i++) {
        if (map.has(s[i])) {
            stack.push(s[i]);
        } else {
            if (map.get(stack.pop()) === s[i]) {
                continue;
            } else {
                return false;
            }
        }
    }
    return stack.length === 0;
};
```

#### 简化路径
*LeetCode71 Medium*
*Tags: string | stack*

给你一个字符串`path`，表示指向某一文件或目录的`Unix`风格 绝对路径（以`'/'`开头），请你将其转化为更加简洁的规范路径。
在`Unix`风格的文件系统中，一个点（.）表示当前目录本身；此外，两个点（..）表示将目录切换到上一级（指向父目录）；两者都可以是复杂相对路径的组成部分。任意多个连续的斜杠（即，'//'）都被视为单个斜杠'/'。对于此问题，任何其他格式的点（例如，'...'）均被视为文件/目录名称。
请注意，返回的**规范路径**必须遵循下述格式：

* 始终以斜杠'/'开头。
* 两个目录名之间必须只有一个斜杠'/'。
* 最后一个目录名（如果存在）不能 以'/'结尾。
* 此外，路径仅包含从根目录到目标文件或目录的路径上的目录（即，不含'.'或'..'）。

返回简化后得到的**规范路径**。

```js
示例 1：
输入：path = "/home/"
输出："/home"
解释：注意，最后一个目录名后面没有斜杠。 

示例 2：
输入：path = "/../"
输出："/"
解释：从根目录向上一级是不可行的，因为根目录是你可以到达的最高级。

示例 3：
输入：path = "/home//foo/"
输出："/home/foo"
解释：在规范路径中，多个连续斜杠需要用一个斜杠替换。

示例 4：
输入：path = "/a/./b/../../c/"
输出："/c"
```

答案：栈
```js
const simplifyPath = (path) => {
    let paths = path.split('/');
    let stack = [];
    for (let i = 0; i < paths.length; i++) {
        if (paths[i] === '..') {
            stack.pop();
        } else if (paths[i] !== '' && paths[i] !== '.') {
            stack.push(paths[i]);
        }
    }
    return '/' + stack.join('/')
};
```
**思路**
利用栈的思想，遍历`path`，当遇到合法的路径名（本题中只有字母、数字、两个以上的'.'和'_'）时入栈，当遇到`'.'`和多个`'/'`时跳过，遇到`'..'`时栈顶元素出站，遍历完成，将栈中元素转换为结果。
* 时间复杂度：O(n)
* 空间复杂度：O(n)
  
#### 移除链表元素
*LeetCode203 easy*
*Tags: linked-list*

给你一个链表的头节点`head`和一个整数`val`，请你删除链表中所有满足`Node.val == val`的节点，并返回**新的头节点**。

```
示例 1：
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]

示例 2：
输入：head = [], val = 1
输出：[]

示例 3：
输入：head = [7,7,7,7], val = 7
输出：[]
```

答案：迭代
**思路**
想要删除链表节点，只要将当前节点的`next`指向想要删除的节点的下一个节点就可以了，需要特殊处理的只有`head`，删除`head`节点只要将当前head节点重新赋值给`head`的`next`，这里可以手动**引入一个哨兵节点**，让它的`next`指向`head`，这样就可以想处理其他节点一样处理`head`了，最后返回哨兵节点的`next`。
```js
const removeElements = (head, val) => {
  const ele = {
      next: head
  }
  let curNode = ele;
  while(curNode.next) {
      if (curNode.next.val === val) {
          curNode.next = curNode.next.next;
      } else {
          curNode = curNode.next;
      }
  }
  return ele.next;
};
```
* 时间复杂度：O(n)
* 空间复杂度：O(1)

#### 反转链表
*LeetCode206 easy*
*Tags: linked-list*

给你单链表的头节点`head`，请你反转链表，并返回反转后的链表。

```
示例 1：
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]

示例 2：
输入：head = [1,2]
输出：[2,1]

示例 3：
输入：head = []
输出：[]
```

答案：迭代
**思路**
反转链表就是要在遍历链表时将当前节点的`next`指向当前节点的前一个节点（prev），所以我们要添加一个变量`prev`来储存前一个节点，在遍历时我们只要重新给当前节点的`cur.next`和`prev`赋值就可以了，`cur.next -> prev`，`prev -> cur`，遍历时每次会将`cur -> cur.next`，处理好三者的关系，最后返回跳出循环时的`prev`。
```js
const reverseList = (head) => {
  let cur = head;
  let prev = null;
  while (cur) {
    // let next = cur.next;
    // cur.next = prev;
    // prev = cur;
    // cur = next;
    // 解构赋值
    [cur.next, prev, cur] = [prev, cur, cur.next];
  }
  return prev;
};
```
* 时间复杂度：O(n)
* 空间复杂度：O(1)
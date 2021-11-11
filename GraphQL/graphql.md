## Introduction to GraphQL

GraphQL是一种用于API的查询语言，是一个使用基于你定义的数据类型系统来执行查询的服务端运行时。GraphQL并么有和任何特定的数据库或者储存引擎绑定，而是依靠你现有的代码和数据支撑。

*GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.*

一个GraphQL服务是通过定义类型和类型上的字段来创建的，然后给每个类型上的每个字段提供解析函数。

一旦一个GraphQL服务运行起来（通常在web服务的一个URL上），它就能接受GraphQL查询，并验证和执行。接收到的查询首先会被检查确保它只应用了已定义的类型和字段，然后运行指定的解析函数来生成结果。

## Queries and Mutations

### Fields

最简单的情况下，GraphQL是关于请求对象上的特定字段。

```python
{
  hero {
    name
  }
}
```

*At its simplest, GraphQL is about asking for specific fields on objects.*

查询和结果结构几乎一样，这是GraphQL最重要的特性，这样一来，你总是能得到你想要的数据，服务器也可以知道客户端请求的字段。

fields可以是String，也可以是Object。

GraphQL查询能够遍历相关对象及其字段，使客户端可以一次请求查询大量相关数据，也不是像REST架构中那样需要多次往返查询。

GraphQL查询会同等看待单个项目或者一个列表的项目，然而我们可以通过schema所指示的内容来预测将会得到哪一种。

*GraphQL queries look the same for both single items or lists of items, however we know which one to expect based on what is indicated in the schema.*

### Arguments

在类似REST的系统中，你只能传递一组简单参数——请求中的query参数和URL段。但是在GraphQL中，每一个字段和嵌套对象都能有自己的一组参数，从而使得GraphQL可以完美替代多次API获取请求。甚至你也可以给标量（scalar）字段传递参数，用于实现服务端的一次转换，而不是每个客户端分别转换。

*In a system like REST, you can only pass a single set of arguments - the query parameters and URL segments in your request. But in GraphQL, every field and nested object can get its own set of arguments, making GraphQL a complete replacement for making multiple API fetches. You can even pass arguments into scalar fields, to implement data transformations once on the server, instead of on every client separately.*

```python
{
	human(id: "1000"){
		name
		height(unit: FOOT)
	}
}
```

参数可以是多种不同的类型，上面例子中，我们使用了一个枚举类型，其代表了一个有限选项集合（本例中为长度单位，即是`METER`或者`FOOT`。GraphQL自带一套默认类型，但是GraphQL服务器可以声明一套自己的定制类型，只要能序列化成你的传输格式即可。

### Aliases

我们可以使用别名，来使用不同的参数查询相同的字段。

```python
{
    empireHero: hero(episode: EMPIRE) {
        name
    }
    jediHero: hero(episode: JEDI) {
        name
    }
}
```

上面的例子中，两个`hero`字段将会存在冲突，但是因为我们可以将其另取一个别名，我们也就可以在一次请求中得到两个结果。

### Fragments

在GraphQL中，可以使用**片段**作为可复用单元。片段可以让你组织一组字段，然后在需要它们的地方引入。

```python
{
	leftComparison: hero(episode: EMPIRE) {
		...comparisonFields
	}
	rightComparison: hero(epidode: JEDI) {
		...comparisonFields
	}
}
fragment comparisonFields on Character {
	name
	appearsIn
	friends {
		name
	}
}
```

上例中，查询良好的使用了重复字段。片段的概念经常用于将复杂的应用数据需求分割成小块，特别是你要将大量不同片段的UI组件组合成一个初始数据获取的时候。

##### 片段中使用变量

片段可以访问查询或变更中声明的变量。

```python
query HeroComparison($first: Int = 3) {
    leftComparison: hero(episode: EMPIRE) {
        ...comparisonFields
    }
    rightComparison: hero(episode: JEDI) {
        ...comparisonFields
    }
}
fargment comparisonFields on Character {
    name
    friendsConnection(first: $first) {
        totalCount
        edges {
            node {
                name
            }
        }
    }
}
```

### Operation name

```python
query HeroNameAndFriends {
    hero {
        friends {
            name
        }
    }
}
```

**操作类型**可以是`query`、`mutation`或`subscription`，描述你打算做什么类型的操作。操作类型是必需的，除非你使用查询简写语法，在这种情况，你无法为操作提供名称或变量定义。

**操作名称**是你的操作的意义和明确的名称。它仅在有多个操作的文档中是必需的，（鼓励使用），它对调试和服务端日志记录非常有用。（类比于匿名函数和函数名）GraphQL中查询、变更和片段的名称，都可以成为服务端用来识别不同GraphQL请求的有效工具。

### Variables

GraphQL拥有一级方法将动态值提取到查询之外，然后作为分离的字典传进去，这些动态值即称为**变量**。

使用变量，需要做三件事：

1. 使用`$variableName`代替查询中的静态值。
2. 申明`$variableName`为查询接收的变量之一。
3. 将`variableName：value`通过传输专用（通常是JSON）的分离的变量字典中。

```python
# { "graphiql": true, "variables": { "episode": JEDI } }
query HeroNameAndFriends($episode: Episode) {
    hero(episode: $episode) {
        name
        friends {
            name
        }
    }
}
```

这样一来，我们的客户端代码就只需要传入不同的变量，而不用构建一个全新的查询了。这意味着查询的参数僵尸动态的——我们决不能使用用户提供的值来字符串插值以构建查询。

##### 变量定义（Variable definitions）

变量定义看上去像是上述查询中的`（$episode: Episode）`。其工作方式跟类型语言中函数的参数定义一样。它以列出所有变量，变量前缀必须为`$`，后跟其类型，本例中为`Episode`。

所有声明的变量都必须是标量、枚举类型或者输入对象类型。所以如果想要传递一个复杂对象到一个字段上，你必须知道服务器上其匹配的类型。可以从Schema页面了解更多关于输入对象类型的信息。

变量定义可以是可选的或者必要的。

##### 默认变量（Default variables）

可以通过在查询中的类型定义后面附带默认值的方式，将默认值赋给变量。

```python
query HeroNameAndFriends($episode: Episode = "JEDI") {
    hero(episode: $episode) {
        name
        friends {
            name
        }
    }
}
```

### Directives

```python
query Hero($episode: Episode, $withFriends: Boolean!) {
    hero(episode: $episode) {
        name
        friends @include(if: $withFriends) {
            name
        }
    }
}
```

上例中，使用GraphQL中的指令特性。一个指令可以附着在字段或者片段包含的字段上，然后以任何服务端期待的方式来改变查询的执行。GraphQL的核心规范包含两个指令：

* `@include(if: Boolean) `仅在参数为`true`时，包含此字段。
* `@skip(if: Boolean)`如果参数为`true`，跳过此字段。

服务端可以定义新的指令来添加新特性。

### Mutations

`mutation`是发送变更请求到服务端的方法。

```python
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

##### 变更中的多个字段（Multiple fields in mutaions）

一个变更也能包含多个字段，一如查询。查询和变更之间名称之外的一个重要区别是：**查询字段时，是并行执行，而变更字段时，是线性执行，一个接着一个**。

这意味着如果我们一个请求中发送了两个`incrementCredits`变更，第一个保证在第二个之前执行，以确保我们不会出现竞态。

### Inline Fragments

如果你查询的字段返回的是接口或者联合类型，那么你可能需要使用**内联片段**来取出下层具体类型的数据：

```python
query HeroForEpisode($eq: Episode!) {
    hero(episode: $ep) {
        name
        ... on Droid {
            primaryFunction
        }
        ... on Human {
            height
        }
    }
}
```

这个查询中，`hero`字段返回`Character`类型，取决于`episode`参数，其可能是`Human`或者`Droid`类型。在直接选择的情况下，你只能请求`Character`上存在的字段，譬如`name`。

如果要请求具体类型上的字段，你需要使用一个类型条件**内联片段**。因为第一个片段标注为`... on Droid`，`primaryFunction`仅在`hero`返回的`Character`为`Droid`类型时才会执行。同理使用与`Human`类型的`height`字段。

### Mata fields

某些情况下，你并不知道你将从GraphQL服务获取得什么类型，这时候你就需要一些方法在客户端来决定如何处理这些数据。GraphQL允许你在查询的任何位置请求`__typename`，一个元字段，以获得那个位置的对象类型名称。

```python
{
    search(text: "an") {
        __typename
        ... on Human {
            name
        }
        ... on Droid {
            name
        }
        ... on Starship {
            name
        }
    }
}
######
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}

```

上面的查询中，`search`返回了一个联合类型，其可能是三种选项之一。没有`__typename`字段的情况下，几乎不能在客户端分辨开这三个不同的类型。




























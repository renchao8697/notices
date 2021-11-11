## Introduction to GraphQL

GraphQL是一种用于API的查询语言，是一个使用基于你定义的数据类型系统来执行查询的服务端运行时。GraphQL并么有和任何特定的数据库或者储存引擎绑定，而是依靠你现有的代码和数据支撑。

*GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.*

一个GraphQL服务是通过定义类型和类型上的字段来创建的，然后给每个类型上的每个字段提供解析函数。

一旦一个GraphQL服务运行起来（通常在web服务的一个URL上），它就能接受GraphQL查询，并验证和执行。接收到的查询首先会被检查确保它只应用了已定义的类型和字段，然后运行指定的解析函数来生成结果。

## Queries and Mutations

### Fields

最简单的情况下，GraphQL是关于请求对象上的特定字段。

```typescript
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

```typescript
{
	human(id: "1000"){
		name
		height(unit: FOOT)
	}
}
```

参数可以是多种不同的类型，上面例子中，我们使用了一个枚举类型，其代表了一个有限选项集合（本例中为长度单位，即是`METER`或者`FOOT`。GraphQL自带一套默认类型，但是GraphQL服务器可以声明一套自己的定制类型，只要能序列化成你的传输格式即可。

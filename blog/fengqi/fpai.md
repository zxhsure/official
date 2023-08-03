<div style="overflow:hidden;"><img src="../assets/me.jpeg" alt="风起" style="border-radius:50%;width: 25px;float:left;"> <div style="float:left;margin-top: 2px;margin-left: 3px;font-size: 12px;">风起</div></div>
<div style="clear:both;font-size: 12px;height:50px;line-height: 34px;">2023-08-03</div>

# 函数式编程/逻辑图/AI

### 什么是函数式编程

程序 = 数据结构 + 算法

算法 = 控制 + 逻辑

控制：比较好理解些，直观的就是 "if、else、switch、for、while" 等控制语句

逻辑：比较抽象，简单理解就是 “意图”

举个例子：要描述向前走路

- 从控制角度来描述是：“如果右脚在前，将左脚抬起来并向前移动，如果左脚在前将右脚抬起来并向前移动，如果两只脚并排则随机一只脚抬起来并向前移动。”

- 从逻辑角度来描述是：“向前走”
- 可以看出逻辑是核心，别扯先迈左脚还是先迈右脚怎么控制，就说是不是向前走的逻辑。

**函数式编程就是弱化了控制，重点关注逻辑，而逻辑就体现在函数的组合上，从函数的组合上就能看出 “意图”。**

下面看代码：

- 示例一

```
const f = (a:number):number => {
	console.log('f');
    return a + 1;
}

const g = (a:number):number => {
	console.log('g');
    return a * 2;
}

const Effect = {
    of: (f:Function) => ({
        map: (g:Function) => Effect.of((a:number)=>g(f(a))),
        run: (a:number) => f(a),
    }),
};
const c = Effect.of(f).map(g).map(f).map(g).run;

const result = c(2);
```

看上面代码，c函数是通过f和g函数组合而成的，要看c的逻辑就看f和g是怎么组合的就行了。

这里f和g函数都不是纯函数，是有io访问的“console.log()”，但不影响他们的组合，因为有延迟执行。

**所以函数式编程无论是通过 “of” 装箱、通过 “map” 拆箱访问做映射、通过 “run” 延迟执行等等设计的这些机制都是为了组合。**

- 示例二，以下代码使用的是ts的函数式编程库“fp-ts”

```
interface Foo {
    readonly tag: 'Foo';
    readonly f: () => number;
}

interface Bar {
    readonly tag: 'Bar';
    readonly g: () => number;
}

const arr: Array<Foo | Bar> = [
    {tag: 'Foo', f: ()=>1},
    {tag: 'Foo', f: ()=>2},
    {tag: 'Foo', f: ()=>3},
    {tag: 'Bar', g: ()=>4},
    {tag: 'Bar', g: ()=>5},
    {tag: 'Bar', g: ()=>6},
];
const monoidSum:Monoid<number> = {
    concat: (a, b) => a + b,
    empty: 0,
};

const monoidMax:Monoid<number> = {
    concat: Math.max,
    empty: Number.NEGATIVE_INFINITY,
}

const computed = (barMonoid:Monoid<number>)=>(fooMonoid:Monoid<number>)=>(arr: Array<Foo | Bar>) => {
    const sum = pipe(
        arr,
        A.filter((item)=>item.tag === 'Foo'),
        A.foldMap(fooMonoid)((foo:Foo)=>foo.f()),
    );
    const max = pipe(
        arr,
        A.filter((item)=>item.tag === 'Bar'),
        A.foldMap(barMonoid)((bar:Bar)=>bar.g()),
    );
    return sum * max;
}

const result = pipe(computed, ap(monoidMax), ap(monoidSum), ap(arr));
```

看上面代码，arr数组里有Foo类型和Bar类型，需求是将arr数组里所有Foo类型相加，然后乘以Bar类型里最大的数。可以看到这样的逻辑是通过computed、monoidMax、monoidSum组合而成的，当然还可以进一步用函数把“+、*、===”这些运算符替换掉，这样就全部通过函数的组合去描述一个逻辑。

函数式编程将数据和函数分离，通过函数组合表达逻辑，而且对于纯函数来说对数据不会产生影响，很容易并行执行。

### 什么情况下用函数式编程

##### 从代码复用的粒度来看：

- 面向对象复用的粒度是对象，一个对象将数据和方法封装在了一起，对象里的方法大多数情况是离不开对象里的数据，想把对象拆开将数据并行处理很难。
- 函数式编程复用的粒度是函数，函数想多小就有多小，小到一个运算符（>）也可以封装成一个函数，而函数式编程天生就是数据和函数分离，并行简单，组合也简单。
- 所以理论上讲，函数式编程代码复用率更高。

##### 从设计角度来看：

- 可以用函数式方式进行领域设计的尝试，对于设计一个系统来说关键的不是数据，而是一些关键事件即核心业务逻辑，参考《函数响应式领域建模》一书。
- 游戏领域的DOD面向数据设计，在我看来是函数式编程，将数据和函数分离，为了更好的支持多核与并行计算。参考[《ECS与面向数据的设计》](https://neil3d.github.io/3dengine/why-ecs.html)

##### 函数式编程这么好是不是就可以万物函数化了，当然不是：

- 一个要考虑的是抽象粒度和成本的平衡
- 另外一种场景就是大量状态的直接操作，例如：前端从接口查到一批字段然后赋值给绑在界面上的另一批字段，虽然逻辑简单但状态的量大，用函数式编程就像是飞机还没起飞就要降落了。这种情况还是直接操作JSON对象"短平快"来的直接。

### 函数式编程和逻辑图的关系

将函数抽象成节点，将函数的组合调用关系抽象成边，这样由节点和边组成了一个逻辑图。

逻辑图就代表了一个系统的整个业务逻辑，可以类比地图，不同级别的图层展现不同粒度的业务逻辑。

我们基于这个逻辑图就可以清晰的做业务迭代，测试等工作。

### 函数式编程和AI的关系

每个数据是有类型签名的，每个函数也是有类型签名的，只要类型签名匹配就可以任意组合逻辑，那么我们提供一批基础函数，通过AI进行函数组合，我们输入逻辑的文字描述，AI输出一个逻辑的函数组合描述。




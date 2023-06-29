import{_ as s}from"./chunks/me.1cb41795.js";import{_ as n,o as a,c as l,O as p}from"./chunks/framework.571309da.js";const e="/assets/wasm-race.330af539.webp",h=JSON.parse('{"title":"wasm VS js，谁快？","description":"","frontmatter":{},"headers":[],"relativePath":"blog/wasm-vs-js.md","filePath":"blog/wasm-vs-js.md"}'),o={name:"blog/wasm-vs-js.md"},t=p('<div style="overflow:hidden;"><img src="'+s+'" alt="风起" style="border-radius:50%;width:25px;float:left;"> <div style="float:left;margin-top:2px;margin-left:3px;font-size:12px;">风起</div></div><div style="clear:both;font-size:12px;height:50px;line-height:34px;">2023-06-28</div><h1 id="wasm-vs-js-谁快" tabindex="-1">wasm VS js，谁快？ <a class="header-anchor" href="#wasm-vs-js-谁快" aria-label="Permalink to &quot;wasm VS js，谁快？&quot;">​</a></h1><p><img src="'+e+`" alt=""></p><p>我们做一个测试，分别用wasm和js构建同一棵树，实现算法也相同，来对比下谁更快，初步了解下wasm的性能，这里用rust编译wasm。</p><p>我们构造的树结构如下</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	name: &quot;node_0_0&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">	children: [</span></span>
<span class="line"><span style="color:#A6ACCD;">		{</span></span>
<span class="line"><span style="color:#A6ACCD;">			name: &quot;node_1_0&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">			children: [...],</span></span>
<span class="line"><span style="color:#A6ACCD;">		},</span></span>
<span class="line"><span style="color:#A6ACCD;">		{</span></span>
<span class="line"><span style="color:#A6ACCD;">			name: &quot;node_1_1&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">			children: [...],</span></span>
<span class="line"><span style="color:#A6ACCD;">		},</span></span>
<span class="line"><span style="color:#A6ACCD;">		...</span></span>
<span class="line"><span style="color:#A6ACCD;">	],</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><h2 id="第一次尝试" tabindex="-1">第一次尝试： <a class="header-anchor" href="#第一次尝试" aria-label="Permalink to &quot;第一次尝试：&quot;">​</a></h2><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">#[derive(Clone)]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub struct Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    name: String,</span></span>
<span class="line"><span style="color:#A6ACCD;">    children: Vec&lt;Item&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn treeFun(treeLevel: u32, nodeWidth: u32) -&gt; Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let tempNode = Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">        name: String::from(&quot;&quot;),</span></span>
<span class="line"><span style="color:#A6ACCD;">        children: vec![],</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut root = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">    root.name = String::from(&quot;node_0_0&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    if treeLevel &lt; 2 {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return root;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack: Vec&lt;&amp;mut [Item]&gt; = vec![];</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for m1 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let mut curItem = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">        curItem.name = format!(&quot;node_{}_{}&quot;, 1, m1);</span></span>
<span class="line"><span style="color:#A6ACCD;">        root.children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut vs: Vec&lt;&amp;mut [Item]&gt; = root.children.chunks_mut(1).collect();</span></span>
<span class="line"><span style="color:#A6ACCD;">    for m2 in vs.iter_mut() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(*m2);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for i in 2..treeLevel {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let curTotal: u32 = nodeWidth.pow(i - 1);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        for j in 0..curTotal {</span></span>
<span class="line"><span style="color:#A6ACCD;">            let shiftItem = nodeStack.remove(0);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            for k1 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">                let mut curItem = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">                curItem.name = format!(&quot;node_{}_{}&quot;, i, nodeWidth * j + k1);</span></span>
<span class="line"><span style="color:#A6ACCD;">                shiftItem[0].children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            let mut ss: Vec&lt;&amp;mut [Item]&gt; = shiftItem[0].children.chunks_mut(1).collect();</span></span>
<span class="line"><span style="color:#A6ACCD;">            for _ in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">                let curSs = ss.remove(0);</span></span>
<span class="line"><span style="color:#A6ACCD;">                nodeStack.push(curSs);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    root</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const treeFun = (treeLevel, nodeWidth) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">	const tempNode = {</span></span>
<span class="line"><span style="color:#A6ACCD;">    	name: &#39;&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    	children: [],</span></span>
<span class="line"><span style="color:#A6ACCD;">	};</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">    const root = JSON.parse(JSON.stringify(tempNode));</span></span>
<span class="line"><span style="color:#A6ACCD;">    root.name = &#39;node_0_0&#39;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    if (treeLevel &lt; 2) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return root;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    const nodeStack = [];</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for (var m1=0; m1&lt;nodeWidth; m1++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        const curItem = JSON.parse(JSON.stringify(tempNode));</span></span>
<span class="line"><span style="color:#A6ACCD;">        curItem.name = \`node_1_\${m1}\`;</span></span>
<span class="line"><span style="color:#A6ACCD;">        root.children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for (var m2=0; m2&lt;nodeWidth; m2++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(root.children[m2]);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for (var i=2; i&lt;treeLevel; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        const curTotal = Math.pow(nodeWidth, (i-1));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        for (var j=0; j&lt;curTotal; j++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            const shiftItem = nodeStack.shift();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            for (var k1=0; k1&lt;nodeWidth; k1++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">                const curItem = JSON.parse(JSON.stringify(tempNode));</span></span>
<span class="line"><span style="color:#A6ACCD;">                curItem.name = \`node_\${i}_\${nodeWidth * j + k1}\`;</span></span>
<span class="line"><span style="color:#A6ACCD;">                shiftItem.children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            for (var k2=0; k2&lt;nodeWidth; k2++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">                nodeStack.push(shiftItem.children[k2]);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    return root;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>我们尝试构造的树有7层深度，每个节点下有8个子节点，共299593个节点，执行结果如下</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">total nodes:  299593</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-tree: 31134.56591796875 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-tree: 7428.5888671875 ms</span></span></code></pre></div><p>可以看到js执行速度明显快，奇怪了，与预期不符。</p><p>分析rust代码，发现这里的逻辑主要包含： 循环、对象深拷贝、向量的切片、数学函数、向量的插入和删除等几部分。</p><p>我们按照这几块分别测试，看看到底哪里慢了。</p><h2 id="第二次尝试-循环性能对比" tabindex="-1">第二次尝试：循环性能对比 <a class="header-anchor" href="#第二次尝试-循环性能对比" aria-label="Permalink to &quot;第二次尝试：循环性能对比&quot;">​</a></h2><p>我们构造4层嵌套的循环</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn forFun(len: usize) -&gt; usize {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut total = 0;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for i in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        total += i;</span></span>
<span class="line"><span style="color:#A6ACCD;">        for j in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">            total += j;</span></span>
<span class="line"><span style="color:#A6ACCD;">            for m in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">                total += m;</span></span>
<span class="line"><span style="color:#A6ACCD;">                for n in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    total += n;</span></span>
<span class="line"><span style="color:#A6ACCD;">                }</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    total</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-\\"><button title="Copy Code" class="copy"></button><span class="lang">\\</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const forFun = (len) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let total = 0;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        total += i;</span></span>
<span class="line"><span style="color:#A6ACCD;">        for (let j=0; j&lt;len; j++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            total += j;</span></span>
<span class="line"><span style="color:#A6ACCD;">            for (let m=0; m&lt;len; m++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">                total += m;</span></span>
<span class="line"><span style="color:#A6ACCD;">                for (let n=0; n&lt;len; n++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    total += n;</span></span>
<span class="line"><span style="color:#A6ACCD;">                }</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    return total;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>将len=50传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-for: 0.138916015625 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-for: 13.94189453125 ms</span></span></code></pre></div><p>可以看到wasm明显快，问题不在这里，继续测试</p><h2 id="第三次尝试-对象深拷贝性能对比" tabindex="-1">第三次尝试：对象深拷贝性能对比 <a class="header-anchor" href="#第三次尝试-对象深拷贝性能对比" aria-label="Permalink to &quot;第三次尝试：对象深拷贝性能对比&quot;">​</a></h2><p>我们反复深拷贝对象进行测试</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">#[derive(Clone)]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub struct Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    name: String,</span></span>
<span class="line"><span style="color:#A6ACCD;">    children: Vec&lt;Item&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn copyFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack = vec![];</span></span>
<span class="line"><span style="color:#A6ACCD;">	let tempNode = Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">        name: String::from(&quot;&quot;),</span></span>
<span class="line"><span style="color:#A6ACCD;">        children: vec![],</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">    for i in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let mut curItem = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">        curItem.name = format!(&quot;node_{}&quot;, i);</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const copyFun = (len) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const nodeList = [];</span></span>
<span class="line"><span style="color:#A6ACCD;">    const tempNode = {</span></span>
<span class="line"><span style="color:#A6ACCD;">    	name: &#39;&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    	children: [],</span></span>
<span class="line"><span style="color:#A6ACCD;">	};</span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        const curItem = JSON.parse(JSON.stringify(tempNode));</span></span>
<span class="line"><span style="color:#A6ACCD;">        curItem.name = \`node_\${i}\`;</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeList.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>将len=5000传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-copy: 7.875 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-copy: 12.510009765625 ms</span></span></code></pre></div><p>可以看到wasm明显快，问题不在这里，继续测试</p><h2 id="第四次尝试-向量切片性能对比" tabindex="-1">第四次尝试：向量切片性能对比 <a class="header-anchor" href="#第四次尝试-向量切片性能对比" aria-label="Permalink to &quot;第四次尝试：向量切片性能对比&quot;">​</a></h2><p>我们将向量的每个元素先进行切片，然后将切片存入另一个向量中</p><p>注意：</p><p>1，rust这里切片完后直接append，没有从ss的头部删一个再加到nodeStack的尾部，排除向量头部删除性能问题</p><p>2，由于js没有切片概念，所以rust用另外一种不用切片的unsafe方法，直接取向量原始指针存入nodeStack</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn sliceFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack: Vec&lt;&amp;mut [usize]&gt; = vec![];</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut arr = vec![1; len];</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut ss: Vec&lt;&amp;mut [usize]&gt; = arr.chunks_mut(1).collect();</span></span>
<span class="line"><span style="color:#A6ACCD;">    nodeStack.append(&amp;mut ss);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn unsafeSliceFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack: Vec&lt;&amp;mut usize&gt; = vec![];</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut arr = vec![1; len];</span></span>
<span class="line"><span style="color:#A6ACCD;">    let ptr = arr.as_mut_ptr();</span></span>
<span class="line"><span style="color:#A6ACCD;">    unsafe {</span></span>
<span class="line"><span style="color:#A6ACCD;">        for i in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">            nodeStack.push(&amp;mut *ptr.add(i));</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const sliceFun = (len) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const nodeStack = [];</span></span>
<span class="line"><span style="color:#A6ACCD;">    const arr = Array(len).fill(1);</span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(arr[i]);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>将len=20000传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-slice: 0.5888671875 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-unsafe-slice: 0.1650390625 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-slice: 6.85205078125 ms</span></span></code></pre></div><p>可以看到无论有么有切片wasm都比js快，当然操作原始指针是最快的。</p><h2 id="第五次尝试-数学函数pow性能对比" tabindex="-1">第五次尝试：数学函数pow性能对比 <a class="header-anchor" href="#第五次尝试-数学函数pow性能对比" aria-label="Permalink to &quot;第五次尝试：数学函数pow性能对比&quot;">​</a></h2><p>我们反复执行pow函数</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn powFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let num: u32 = 10;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for i in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        num.pow(i.try_into().unwrap());</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const powFun = (len) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const num = 10;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        Math.pow(num, i);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>将len=7000传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-pow: 0.0478515625 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-pow: 1.115234375 ms</span></span></code></pre></div><p>还是wasm快，继续测试</p><h2 id="第六次尝试-vector性能对比" tabindex="-1">第六次尝试：vector性能对比 <a class="header-anchor" href="#第六次尝试-vector性能对比" aria-label="Permalink to &quot;第六次尝试：vector性能对比&quot;">​</a></h2><p>我们在一个向量里做尾部插入，头部删除来测试</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">#[derive(Clone)]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub struct Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    name: String,</span></span>
<span class="line"><span style="color:#A6ACCD;">    children: Vec&lt;Item&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn vecFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack = vec![];</span></span>
<span class="line"><span style="color:#A6ACCD;">    for _ in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let tempNode = Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">            name: String::from(&quot;&quot;),</span></span>
<span class="line"><span style="color:#A6ACCD;">            children: vec![],</span></span>
<span class="line"><span style="color:#A6ACCD;">        };</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(tempNode);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for _ in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.remove(0);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">const vecFun = (len) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const nodeStack = [];</span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        const item = {</span></span>
<span class="line"><span style="color:#A6ACCD;">            name: &#39;&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">            children: [],</span></span>
<span class="line"><span style="color:#A6ACCD;">        };</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push(item);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for (let i=0; i&lt;len; i++) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.shift();</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>将len=7000传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-vec: 481.01708984375 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-vec: 6.257080078125 ms</span></span></code></pre></div><p>wasm这么慢，这时又测试了下向量的push，虽然push可能触发向量扩容及拷贝元素（<a href="https://www.educative.io/answers/memory-management-of-vectors-in-rust" target="_blank" rel="noreferrer">参考向量大小与容量</a>），但发现push很快，确定是向量头部删除很慢。</p><p>问题找到了，我们现在优化，发下构造树用到的队列只在两头操作，所以想到了双端队列</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn vecDeqFun(len: usize) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack: VecDeque&lt;Item&gt; = VecDeque::new();</span></span>
<span class="line"><span style="color:#A6ACCD;">    for _ in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let item = Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">            name: String::from(&quot;&quot;),</span></span>
<span class="line"><span style="color:#A6ACCD;">            children: vec![],</span></span>
<span class="line"><span style="color:#A6ACCD;">        };</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.push_back(item);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for _ in 0..len {</span></span>
<span class="line"><span style="color:#A6ACCD;">        nodeStack.pop_front();</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>再次将len=7000传入执行，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">wasm-vec: 508.14501953125 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-vec-deq: 0.658935546875 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-vec: 7.974853515625 ms</span></span></code></pre></div><p>可以看到wasm-vec-deq用时最短，即双端队列最适合这种场景</p><h2 id="第七次尝试-重构树的构建-性能对比" tabindex="-1">第七次尝试：重构树的构建，性能对比 <a class="header-anchor" href="#第七次尝试-重构树的构建-性能对比" aria-label="Permalink to &quot;第七次尝试：重构树的构建，性能对比&quot;">​</a></h2><p>现在用双端队列及向量原始指针重构树的构建</p><p>rust代码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">#[derive(Clone)]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub struct Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    name: String,</span></span>
<span class="line"><span style="color:#A6ACCD;">    children: Vec&lt;Item&gt;,</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">#[wasm_bindgen]</span></span>
<span class="line"><span style="color:#A6ACCD;">pub fn unsafeTreeFun(treeLevel: u32, nodeWidth: u32) -&gt; Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    let tempNode = Item {</span></span>
<span class="line"><span style="color:#A6ACCD;">        name: String::from(&quot;&quot;),</span></span>
<span class="line"><span style="color:#A6ACCD;">        children: vec![],</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut root = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">    root.name = String::from(&quot;node_0_0&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    if treeLevel &lt; 2 {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return root;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let mut nodeStack: VecDeque&lt;&amp;mut Item&gt; = VecDeque::new();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for m1 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let mut curItem = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">        curItem.name = format!(&quot;node_{}_{}&quot;, 1, m1);</span></span>
<span class="line"><span style="color:#A6ACCD;">        root.children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    let ptr1 = root.children.as_mut_ptr();</span></span>
<span class="line"><span style="color:#A6ACCD;">    unsafe {</span></span>
<span class="line"><span style="color:#A6ACCD;">        for m2 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">            nodeStack.push_back(&amp;mut *ptr1.add(m2.try_into().unwrap()));</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    for i in 2..treeLevel {</span></span>
<span class="line"><span style="color:#A6ACCD;">        let curTotal: u32 = nodeWidth.pow(i - 1);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        for j in 0..curTotal {</span></span>
<span class="line"><span style="color:#A6ACCD;">            let shiftItem = nodeStack.pop_front().unwrap();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            for k1 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">                let mut curItem = tempNode.clone();</span></span>
<span class="line"><span style="color:#A6ACCD;">                curItem.name = format!(&quot;node_{}_{}&quot;, i, nodeWidth * j + k1);</span></span>
<span class="line"><span style="color:#A6ACCD;">                shiftItem.children.push(curItem);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            let ptr2 = shiftItem.children.as_mut_ptr();</span></span>
<span class="line"><span style="color:#A6ACCD;">            unsafe {</span></span>
<span class="line"><span style="color:#A6ACCD;">                for k2 in 0..nodeWidth {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    nodeStack.push_back(&amp;mut *ptr2.add(k2.try_into().unwrap()));</span></span>
<span class="line"><span style="color:#A6ACCD;">                }</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    root</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>js代码参考第一次尝试里的，这里没有变。</p><p>还是一个7层深度，每个节点下8个子节点，共299593个节点的树，执行结果</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">total nodes:  299593</span></span>
<span class="line"><span style="color:#A6ACCD;">wasm-deq-tree: 347.54443359375 ms</span></span>
<span class="line"><span style="color:#A6ACCD;">js-tree: 7232.81201171875 ms</span></span></code></pre></div><p>最终可以看到wasm快的多，对于树的构建速度大概是js的20倍</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这里测试只考虑wasm和js的执行速度，排除了wasm和js传递大量数据的场景，只是纯粹的体验下wasm的执行速度。</p><p>通过这个测试了解到，wasm从设计机制上确实比js运行得快，如果发现不快就要开始反思，是不是自己代码写的有问题。</p><p>至于wasm和js的传参，始终遵循最小化序列化和最小化复制的原则，参考<a href="./wasm-memory.html">《wasm内存模型》</a></p>`,83),c=[t];function i(C,r,A,y,D,m){return a(),l("div",null,c)}const g=n(o,[["render",i]]);export{h as __pageData,g as default};

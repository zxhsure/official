<div style="overflow:hidden;"><img src="../assets/me.jpeg" alt="风起" style="border-radius:50%;width: 25px;float:left;"> <div style="float:left;margin-top: 2px;margin-left: 3px;font-size: 12px;">风起</div></div>
<div style="clear:both;font-size: 12px;height:50px;line-height: 34px;">2023-07-03</div>

# 搭建wasm环境
- ## 搭建rust环境
    
    - 安装通用编译开发环境  
    
      sudo apt update  
      sudo apt install build-essential gcc cmake pkg-config libssl-dev libfontconfig libfontconfig1-dev  
    - 安装rust
    
      curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh  
      cargo会随rust一起安装  
    
- ## 搭建wasm环境，针对国内网络遇到的问题提前做些准备工作
    
    - 安装wasm-pack工具  
    cargo install wasm-pack  
    - 安装wasm-binden-cli工具  
    cargo install wasm-bindgen-cli  
    注意：需要跟cargo.toml里的版本一致
    - 安装wasm-opt工具  
    sudo apt install binaryen  
    查看wasm-opt所在目录: "whereis wasm-opt", 一般在“/usr/bin/wasm-opt”  
    拷贝到“~/.cargo/bin/”里  
    cp /usr/bin/wasm-opt ~/.cargo/bin 
    
- ## 配置cargo国内镜像

    - 可以在网上搜，ustc感觉还可以

- ## 准备前端开发环境，

    - 安装node可以先装nvm然后用nvm选择某个node版本进行安装，这样方便切换node版本，可以在网上搜如何安装nvm

- ## 如果需要一个 'hello, world!' 简单的示例工程

  - 可以安装cargo-generate，执行下面两句命令  

    cargo install cargo-generate  
    cargo generate --git https://github.com/rustwasm/wasm-pack-template  
    这样得到一个示例工程，怎么运行，参考：https://rustwasm.github.io/docs/book/game-of-life/hello-world.html

- ## 如果是windows上的WSL2，或mac上的multipass虚拟机，需要使用主机代理时，要注意：
    
    - windows上的防火墙入站规则需要加上允许WSL访问主机  
    代理软件也需要允许局域网访问
    - mac上的multipass虚拟机配置就相对简单，需要在代理软件上确认好代理地址和端口
      




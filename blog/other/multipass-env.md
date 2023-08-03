<div style="overflow:hidden;"><img src="../assets/me.jpeg" alt="风起" style="border-radius:50%;width: 25px;float:left;"> <div style="float:left;margin-top: 2px;margin-left: 3px;font-size: 12px;">风起</div></div>
<div style="clear:both;font-size: 12px;height:50px;line-height: 34px;">2023-07-03</div>

# 利用Multipass在MAC上轻量化搭建ubuntu环境

有一个MAC本，但开发环境打算用ubuntu，于是找到了Multipass，安装参考[Multipass官网](https://multipass.run/docs/how-to-guides)

## Multipass常用命令

### 创建实例

multipass launch -n vm1
multipass launch lts --name vm1 --memory 4G --disk 30G --cpus 2
multipass launch -n vm1 --cloud-init vm.yaml

### 调整cpu,内存,磁盘
multipass set local.vm1.cpus=2
multipass set local.vm1.memory=4G
multipass set local.vm1.disk=30G

### 打开实例的shell
multipass shell vm1

### 配置ssh登录
sudo vim /etc/ssh/sshd_config
PasswordAuthentication yes
PermitEmptyPasswords yes
service ssh restart

### 配置root密码，删除ubuntu用户密码
sudo passwd root
su
passwd -d ubuntu

### 挂载本地磁盘到vm1上(虚拟机本身磁盘小的话容易掉和关闭), 卸载挂载的磁盘
multipass mount /Users/spirit/fwork vm1:/home/ubuntu/fwork
multipass umount vm1

### vscode 安装remote-ssh插件，配置ssh客户端
vim ~/.ssh/config
- 添加下面内容，HostName为实例ip，可通过multipass list查看
  Host vm1
        HostName 192.168.64.7
        User ubuntu

### 查看实例列表
multipass list

### 启动实例
multipass start vm1 vm2

### 停止实例
multipass stop vm1 vm2

### 删除实例
multipass delete vm1
multipass purge

### coud-init yaml examples

根据yaml文件配置实例，网络原因没成功过，仅做参考

https://cloudinit.readthedocs.io/en/latest/reference/examples.html

## 问题与修复

### Instance stopped while starting

multipass set local.driver=qemu

### rustc 编译报错 Linker 'cc' not found

rust基础环境搭建，参考：[搭建wasm环境](../rww/wasm-env.md)

sudo apt-get update
sudo apt install build-essential
sudo apt install gcc cmake

### openssl-sys error
sudo apt install libssl-dev
sudo apt install pkg-config


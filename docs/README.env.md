> npm私服搭建
# 一、docker
## 1.docker安装
windows10的环境，使用 [docker desktop](https://www.docker.com/products/docker-desktop)。要注册账号的。
## 2.docker设置
### shared drives
C盘D盘要共享。(后面nexus的volume要用到)。

### Daemon
可以设置一个镜像。一般使用阿里云的私有镜像。[阿里云镜像加速器](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)。阿里的东西越埋越深，找都要找半天。
```
  "registry-mirrors": [
    "https://xxxxxxx.mirror.aliyuncs.com"
  ],
```
## 3.Kitematic安装
这个东西可以不安装，因为官方提供的版本是坏的，有BUG！！！然后我clone了git上的master下来改，BUG更多！！！要改的话，时间成本太高了，算了。可以使用之前的release，然后从桌面启动。

## 4.nexus的image
image的搜索，在[docker hub](https://hub.docker.com/search/?type=image)，搜索nexus3，按照提示安装。
```
docker run -d -p 10081:8081 -v /d/docker/nexus11:/nexus-data --name nexus sonatype/nexus3:latest
```
| 命令                               | 解释                                            |
| ---------------------------------- | ----------------------------------------------- |
| `-d`                               | 后台运行容器，并返回容器ID                      |
| `-p 10081:8081`                    | 指定端口映射，格式为：主机(宿主)端口:容器端口   |
| `-v /d/docker/nexus11:/nexus-data` | 指定挂载的volume地址，格式为：主机目录:容器目录 |
| `--name nexus`                     | 为容器指定一个名称                              |
| `sonatype/nexus3:latest`           | image的名称:image的TAG                          |
**！！！注意**
1. 一定要设置`-p 10081:8081`端口，不然后面改起来非常麻烦。不建议修改，可以直接新建一个，挂之前的volume就可以了。如果一定要修改，可以参考[stackoverflow](https://stackoverflow.com/questions/19335444/how-do-i-assign-a-port-mapping-to-an-existing-docker-container#)修改配置文件
2. 不建议手动修改container配置。可以重启一个，挂载相同的volume就可以了。container只是一个进程，并不是程序本身。
3. 挂载volume。
   - 通过设置shared drives共享的磁盘，不会出现在 `docker volume ls` 里面。可以理解为外挂的。非docker系统内部的。
   - 挂载的文件夹必须存在，就是说要先手动新建这个文件夹！
4. 进入container，可以看到挂载的文件夹 `nexus-data`
    ```
    docker exec -it nexus11 /bin/bash
    ls -l
    ```
## 5.C盘瘦身
C盘要爆了，一下占了好多个G，全都移到D盘。
改2个地方。
> Hyper-V设置--虚拟机
> 
> docker settings--advanced

# 二、nexus
根据[npm 私有模块的3种方法](https://www.jianshu.com/p/a9540d9f8d9c)的第三种方法来配置的。这个文档的创建账号不对，角色要选`nx-admin`的才能去`publish`

## 1.创建Blob Stores
| input | value            |
| ----- | ---------------- |
| Type  | file(option)     |
| Name  | BlobName(string) |
| Path  | BlobPath(string) |
## 2.创建npm(proxy)
| input          | value                      |
| -------------- | -------------------------- |
| Name           | npm(proxy)'s name          |
| Remote storage | https://registry.npmjs.org |
| Blob Store     | BlobName(option)           |
## 3.创建npm(hosted)
| input      | value              |
| ---------- | ------------------ |
| Name       | npm(hosted)'s name |
| Blob Store | BlobName(option)   |
## 4.创建npm(group)
| input               | value                      |
| ------------------- | -------------------------- |
| Name                | npm(group)'s name          |
| Blob Store          | BlobName(option)           |
| Member repositories | 1.npm(hosted) 2.npm(proxy) |
## 5.新建用户
## ~~6.加入nrm~~
```
nrm ls
nrm add privateNpm http://localhost:10081/repository/npm-group/
nrm use privateNpm
```
## 7.修改私有library的提交地址(package.json)
```
"publishConfig": {
  "registry": "http://localhost:10081/repository/npm-private/"
},
```
# 三、npm私服问题
## 1.`npm login`之后`publish`
在nexus的`Security > Realms`里面，添加`npm Bearer Token Realm`。**注意！！**只有`role`为`nx-admin`的账户有提交权限。

登录：注意地址是`npm-private`，不是`npm-group`
```
npm login --registry=http://localhost:10081/repository/npm-private/
```
## 2.`.npmrc`文件的编辑
根据官方提示来生成auth是有问题的。windows10下，用`powershell`和`cmd`生成的都不一样！！！
```
echo -n 'admin:admin123' | openssl base64
YWRtaW46YWRtaW4xMjMNCg==          //by powershell
LW4gJ2FkbWluOmFkbWluMTIzJyANCg==  //by cmd
YWRtaW46YWRtaW4xMjM=              //the right one
```
只能用这个方法来生成：

新建一个文件，写入`用户名:密码`，不能有空格，不能换行。
```
admin:admin123
```
然后在文件所在目录运行
```
certutil /encode in.txt out.txt
```
项目文件夹下新建文件`.npmrc`
```
registry=http://localhost:10081/repository/npm-group/
_auth=YWRtaW46YWRtaW4xMjM=
email=12694525@qq.com
```
然后就可以不登录，直接提交了。
# 四、npm
## 1.npm link
本地包开发的时候，把包目录link到`C:\Users\Administrator\node_modules\`目录下，可以看到就是一个链接
```
cd packages\packageName\
npm link
```
然后在项目目录下，link需要的包
```
cd projectName
npm link packageName
```
这个包就`link`到了项目的`node_modules`里面，可以本地开发调试包了。
## 2.peerDependencies
指定所需要兼容的宿主包的版本。npm3之后不会强制安装，只会`warning`。包之间的需求宿主包版本冲突，会导致error。

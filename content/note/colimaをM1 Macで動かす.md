---
title: colimaをM1 Macで動かす
date: 2024-02-01T17:52:00+09:00
tags:
  - Docker
lastmod: '2024-12-26T13:08:25+09:00'
---

{{< card-link "https://github.com/abiosoft/colima" >}}

最小限の設定だけでmacOSやLinuxで動くcontainer runtime。
VMはlimaを使っている。

## インストール

```shell
$ brew install colima

$ colima version
colima version 0.8.1
git commit: 96598cc5b64e5e9e1e64891642b91edc8ac49d16

runtime: docker
arch: aarch64
client: v27.4.1
server: v27.3.1
```

Docker CLI, docker-compose, docker-credential-helperは別途インストールする

```shell
$ brew install docker

$ brew install docker-compose
$ mkdir -p ~/.docker/cli-plugins
$ ln -sfn /opt/homebrew/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose

$ brew install docker-credential-helper
```

```json:title=~/.docker/config.json
{
  "credsStore": "osxkeychain",
  "currentContext": "colima",
}
```

## colima templateで設定変更する

colima起動時の設定値は `$HOME/.colima/<profile>/colima.yaml` あるいは `$XDG_CONFIG_HOME/colima/<profile>/colima.yaml` にある。
profileはデフォルトでは `default` 。

`$XDG_CONFIG_HOME/colima/default/colima.yaml` を直接編集してもいいが、colimaのアップデート時にリセットされることがあった。
`colima template` で開いた設定ファイルに保存するといいらしい。
実態は `$XDG_CONFIG_HOME/colima/_templates/default.yaml` 

最低限このあたりの設定を変更した。

```yaml
cpu: 8
disk: 120
memory: 8
vmType: vz
mountType: virtiofs
network:
  dns:
    - 8.8.8.8
    - 1.1.1.1
```

## M1 macでx86_64向けイメージを動かす

```shell
$ colima start -p x86_64 --vm-type vz --vz-rosetta --mount-type virtiofs
INFO[0000] starting colima [profile=x86_64]
INFO[0000] runtime: docker
INFO[0003] creating and starting ...                     context=vm
FATA[0003] error starting vm: error at 'creating and starting': qemu is required to emulate x86_64: qemu-img not found, run 'brew install qemu' to install
```

言われた通りqemuをインストールする

```shell
$ brew install qemu
```

```shell
$ colima start -p x86_64 --arch x86_64 --vm-type vz --vz-rosetta --mount-type virtiofs
INFO[0000] starting colima [profile=x86_64]
INFO[0000] runtime: docker
INFO[0002] creating and starting ...                     context=vm
INFO[0002] downloading disk image ...                    context=vm
INFO[0096] provisioning ...                              context=docker
INFO[0102] starting ...                                  context=docker
INFO[0106] done

$ colima list
PROFILE    STATUS     ARCH       CPUS    MEMORY    DISK      RUNTIME    ADDRESS
default    Broken     aarch64    8       8GiB      100GiB
x86_64     Running    x86_64     8       8GiB      100GiB    docker
```

## port mappingを有効にするには

macOSではデフォルトで、VMに到達可能なIPアドレスが振られないようになっている。
このとき、 `docker run -p 80:80` などとしてもportがマッピングされないのでホストからコンテナ内のアプリケーションに接続できない。

この設定を有効にするとマッピングされるようになる。
ただしルート権限が必要で、colimaの起動も遅くなる。

https://github.com/abiosoft/colima/blob/main/docs/FAQ.md#enable-reachable-ip-address

設定ファイル `~/.colima/default/colima.yaml` に `network.address=true` を記載する。

```diff
network:
-  address: false
+  address: true
```

## コンテナ内からhostにアクセスするには

Docker Desktopでは `host.docker.internal` のFQDNでコンテナ内部からホストにアクセスできる。
colimaの場合、デフォルトではこのFQDNではなく `host.lima.internal` を使用する。

`host.docker.internal` を使いたい場合は、設定ファイルでリゾルブ先を指定すればよい

```yaml
network:
  dnsHosts:
    host.docker.internal: host.lima.internal
```

## Lima VMがBrokenになったときは

`colima start` ができなくなることがある

```shell
$ colima start
INFO[0000] starting colima
INFO[0000] runtime: docker
INFO[0002] starting ...                                  context=vm
> Using the existing instance "colima"
> errors inspecting instance: [failed to connect to ".config/colima/_lima/colima/ha.sock": stat .config/colima/_lima/colima/ha.sock: no such file or directory]
FATA[0002] error starting vm: error at 'starting': exit status 1
```

ステータスを見るとBrokenとなっている
```shell
$ colima list
PROFILE    STATUS     ARCH       CPUS    MEMORY    DISK      RUNTIME    ADDRESS
default    Broken     aarch64    8       8GiB      100GiB
```

ないよと言われているファイルが本当にないのか見てみる

```shell
$ ll ~/.config/colima/_lima/colima
cloud-config.yaml
colima.yaml
diffdisk
ha.pid
ha.stderr.log
lima-version
lima.yaml
ssh.config
vz.pid
```

pidが残ってしまっているらしい。強制停止してみるとpidファイルが削除されて、起動できるようになった

```shell
$ colima stop -f
INFO[0000] stopping colima
INFO[0000] stopping ...                                  context=vm
INFO[0001] done

$ ll ~/.config/colima/_lima/colima
cloud-config.yaml
colima.yaml
diffdisk
ha.stderr.log
lima-version
lima.yaml
ssh.config
```

これでも
どうにもならないことがあったので、`$XDG_CONFIG_HOME/colima/_lima` 配下を消して作り直した。。
これまでダウンロードしたイメージなどが全部消えるがしかたない
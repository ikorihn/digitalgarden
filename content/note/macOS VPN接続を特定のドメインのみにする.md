---
title: macOS VPN接続を特定のドメインのみにする
date: 2024-12-11T09:39:00+09:00
---

すべての通信をVPN経由にするオプションを有効にすれば接続できるが、全通信をVPN経由にはしたくないので特定の通信だけをVPN経由にしたい。

[MacOS VPN経由を特定のIPアドレスだけにしたいとき #macOS - Qiita](https://qiita.com/imaiworks/items/b89a0efc746d458d9bc1)


```shell
sudo touch /etc/ppp/ip-up
sudo chmod 744 /etc/ppp/ip-up
```

```shell
#!/bin/bash

if [ "$1" = "ppp0" ]; then
  date > /tmp/upppp0
  /sbin/route add -net <対象IP1> -interface ppp0
  /sbin/route add -net <対象IP2> -interface ppp0
fi
```

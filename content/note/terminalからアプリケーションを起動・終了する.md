---
title: terminalからアプリケーションを起動・終了する
date: "2022-03-04T10:37:00+09:00"
tags:
  - 'shell'
  - 'Mac'
lastmod: "2022-03-04T10:38:00+09:00"
---

#shell #Mac

### 起動

```shell
osascript -e "quit app '<アプリケーション名>'"
```

### 終了

```shell
open -a "<アプリケーション名>"
```

[[ネットワークに応じて処理を振り分けるスクリプト]] と組み合わせれば、自宅では起動したいが会社ではオフにしたいアプリケーション(VPNなど)を自動オンオフできる

---
title: Advanced URIとcronを使って毎日Daily noteが作られるようにする
date: 2025-01-05T17:34:00+09:00
tags:
  - obsidian
---

[Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) とcronを使って、毎日決まった時間にdailynoteが作られるようにしたかった。
結論、時間通りに実行されている様子がなかったので諦めた。
代わりに、 [[termuxでcronieを使って定期処理を実行する]] ことにした

## 以下ボツ案

```
0 0 * * * open 'obsidian://adv-uri?vault=obsidian&daily=true'
```

これだけだとsleep時に実行されないので、pmsetで夜間に起動するようにしておく
```shell
sudo pmset repeat wake MTWRFSU 23:59:50
```

-> pmsetしたけど効いていない様子だった
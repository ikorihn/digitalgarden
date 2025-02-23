---
title: Git shallow cloneしたリポジトリであとからより多くの履歴を取得する
date: 2025-01-06T16:53:00+09:00
tags:
  - git
---
 
```shell
git fetch --depth=<取得したいコミット数> origin
```

## 特定のタグを起点にする

```shell
git fetch --depth=<取得したいコミット数> origin refs/tags/<タグ名>:refs/tags/<タグ名>
```
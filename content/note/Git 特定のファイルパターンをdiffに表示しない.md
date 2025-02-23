---
title: Git 特定のファイルパターンをdiffに表示しない
date: 2025-01-20T14:38:00+09:00
tags:
  - git
---

git diffで `package-lock.json` やテストデータの差分が表示されないようにする方法

## pathspecで指定する

gitでpathを絞る仕様として [pathspec](https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec) がある。
`:` につづけて指令を書くことができ、grep時などにファイル除外やディレクトリ指定など高度なことができる。

これを利用して、 `:(exclude)<path>` と書いて除外することができる。

```shell
git diff -- ':(exclude)*/package-lock.json' ':(exclude)*/test/'

# `!` は `(exclude)` のshorthandなのでこれでもいい
git diff -- ':!*/package-lock.json' ':!*/test/'
```

| magic signature | magic word | 効果                                                                    |
| --------------- | ---------- | :-------------------------------------------------------------------- |
| `/`             | top        | 通常はカレントディレクトリ以下が検索対象になるが、これをつけるとルートディレクトリから検索になる                      |
|                 | literal    | `*`, `?` といった特殊な記号をただの文字列として扱う                                        |
|                 | icase      | ignorecase. 大文字と小文字を区別しない                                             |
|                 | glob       | globパターンが使える。`**` で階層を任意にできる                                          |
|                 | attr       | attributeを利用する [gitattributes](https://git-scm.com/docs/gitattributes) |
| `!`,`^`         | exclude    | 除外                                                                    |

## gitattribute

https://git-scm.com/docs/gitattributes

特定のファイルパターンをbinaryとすることで除外できる。

binaryは `-diff -merge -text` のbuilt-in macro
`.gitattributes`
```
package-lock.json binary
yarn.lock binary
```
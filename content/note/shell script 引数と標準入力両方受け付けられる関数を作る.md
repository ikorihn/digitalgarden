---
title: shell script 引数と標準入力両方受け付けられる関数を作る
date: 2024-11-11T14:38:00+09:00
tags:
  - shell
---


```
function infolog() {
  local prefix_text="[INFO]"
  local input=$@

  # Check if input is from a pipe
  if [[ -p /dev/stdin ]]; then
    while IFS= read -r line; do
      echo -e "${prefix_text} ${line}"
    done
  else
    echo -e "${prefix_text} ${input}"
  fi
}
```

```shell
$ ls | infolog
[INFO] file1
[INFO] file2
[INFO] file3

$ infolog Hello, world!
[INFO] Hello, world!
```
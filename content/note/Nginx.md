---
title: Nginx
date: 2024-12-05T16:23:00+09:00
---


## default_server

[How nginx processes a request](https://nginx.org/en/docs/http/request_processing.html)

`nginx.conf`
```conf
server {
    listen       80 default_server; # <-この設定値
    server_name  example.org  www.example.org;
    ...
}
```

まず `Host` ヘッダを検査してどのserverにルーティングするかを決める。
`Host` ヘッダがどのserver_nameともマッチしない場合、または `Host` ヘッダが含まれていない場合はデフォルトサーバーに振り分ける。
デフォルトサーバーは一番上に書いたserverか、`listen` ディレクティブの `default_server` を使って明示的に指定することもできる。

`Host` ヘッダがマッチしないリクエストがデフォルトサーバーで処理されるというのを最初知らなくて、なぜ処理できているのか疑問だった。
`Host` ヘッダがマッチしないリクエストを処理させたくない場合は、リクエストをドロップさせるデフォルトサーバを設定する。

```
server {
    listen      80;
    server_name "";
    return      444;
}
```
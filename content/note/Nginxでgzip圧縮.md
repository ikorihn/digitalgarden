---
title: Nginxでgzip圧縮
date: 2024-12-03T15:21:00+09:00
---

[[Nginx]] におけるWebサイトのパフォーマンス改善の一つにレスポンスの圧縮がある。

[Improve Performance  |  Compute Engine Documentation  |  Google Cloud](https://cloud.google.com/compute/docs/api/how-tos/performance)

ファイルサイズが小さくなるため、サーバーとクライアント間でのデータ転送量が削減され、帯域幅の節約、ユーザー体験の向上、ネットワークのコストの削減が期待できる。


Nginxでの設定方法は以下
[Compression and Decompression | NGINX Documentation](https://docs.nginx.com/nginx/admin-guide/web-server/compression/)

## Load Balancerの背後にあるNginxのレスポンスが圧縮されていない

LBやCDNを経由時にViaヘッダが付与されるとNginxはデフォルトではgzip圧縮しない。
圧縮させるためには、 `gzip_proxied` を設定する必要がある。

- [Module ngx\_http\_gzip\_module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip_proxied)
- [nginx - Google cloud load balancer not returning Content-Encoding: gzip - Server Fault](https://serverfault.com/questions/927197/google-cloud-load-balancer-not-returning-content-encoding-gzip)
- [コンテンツキャッシュとVaryヘッダとnginx #nginx - Qiita](https://qiita.com/cubicdaiya/items/09c8f23891bfc07b14d3)
- [nginx - What are the options for the gzip\_proxied directive for? - Stack Overflow](https://stackoverflow.com/questions/33375304/what-are-the-options-for-the-gzip-proxied-directive-for)

## Varyヘッダをつける

CDNに対してgzip圧縮されたものとされていないものそれぞれのキャッシュを保存するように伝えるために、 `Vary: Accept-Encoding` をつける。
Apacheだと勝手に付与してくれるがNginxの場合は `gzip_vary on` を設定する。

## 最終的なconfig

```
server {

    gzip on;
    gzip_types text/plain text/css application/javascript;
    gzip_min_length 1024;
    gzip_vary on;
    gzip_proxied any;
}

```


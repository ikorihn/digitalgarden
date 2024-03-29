---
title: NatureRemo
date: "2020-11-09T19:42:00+09:00"
tags:
  - Go
  - meetup
lastmod: '2021-05-30T18:41:05+09:00'

---

# 2020-11-18 Nature Remo Go 勉強会

## シングルバイナリにこだわる (@fujiwara)

-   Go で Lambda
    -   ランタイムの寿命に影響されにくい
    -   起動が早い
-   LambdaでもCLIでも動く一個のバイナリを置いておきたい
-   `AWS_EXECUTION_ENV` の環境変数があるかどうかで判別
-   Lambdaでは起動時にコマンドライン引数を指定できないのでflagは環境変数でも指定できるようにしておく
-   Lambdaでもそうでない環境でも動くようにしておくとEC2への移植性が高まる

## fluct事例 (@suzu_v)

-   スループット
-   ちょっとビルド・テストをしやすくしたいときにGoがちょうどいい

## Nature Remo (@songmu)

-   github.com/Songmu/gotesplit
-   CIのテスト並列実行をかんたんに実現

## Goのメリット・デメリット

-   HTMLを返すのは向いてない
-   JSON、HTTP、ログ出力とかはむいてる、HTML以外だったらだいたい合ってる
-   バイナリが必要なのでスクリプト的使い方はしづらい
-   goroutine使っても並行処理は大変
-   非同期処理やりやすいしやりたくなっちゃうけど、レビュー大変なので落とし所とか局所的につかうとかが大事
-   code generationしたりtypeでswitchしたり泥臭い部分は多くなっちゃう

## 開発周り

-   vim,vscode,ideaなんでも
-   gopls,gofmtあるからどうにでもなる

## パッケージ・アーキテクチャ

-   パッケージ粒度
    -   名前がしっくりくるかくらい
    -   ライブラリとして独立できそうかくらいでパッケージ切ってる
    -   loggerはログ用のパッケージで独立したほうがいいなとか
-   あんまりしっかりわけてない
-   最初からわけるとわけすぎたってなっちゃうこともある、最初から分けておいてそれ以上わけない
-   package.run を本体として、main.mainからはそれだけ呼ぶみたいにしてる

## バージョン

-   随時上げちゃう
-   CI通ればいいでしょ、上げて壊れることはほとんどない
-   go mod 入って移さなきゃなーみたいなのはあっても
-   盲目的に上げる、大きい変更だったら話題になる、release partyみたいのでわかる

## 今後Goに期待すること

-   けっこうバランスがいいので新機能はそんなに
-   embedはいい

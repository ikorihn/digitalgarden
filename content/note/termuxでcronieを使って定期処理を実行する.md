---
title: termuxでcronieを使って定期処理を実行する
date: "2025-02-23T23:30:00+09:00"
tags:
  - termux
lastmod: '2025-02-23T23:30:55+09:00'
---
 
## はじめに

Termuxは、Androidデバイス上でLinux環境を提供するアプリです。cronieは、Linuxのcronジョブを管理するためのデーモンで、定期的なタスクを自動的に実行するのに役立ちます。このノートでは、Termuxでcronieを設定し、定期処理を実行する方法について説明します。

## cronieのインストール

まず、Termuxにcronieをインストールします。以下のコマンドを実行してください。

```bash
pkg install cronie
```

## cronieの設定

インストールが完了したら、cronieを設定します。

### crontabの編集
以下のコマンドでcrontabを編集します。

```bash
crontab -e
```

ここで、実行したいコマンドとその実行頻度を指定します。例えば、毎日午前2時にスクリプトを実行する場合は、次のように記述します。

```
0 2 * * * /data/data/com.termux/files/home/scripts/myscript.sh
```

## cronieの起動

cronieを起動するには、以下のコマンドを実行します。

```bash
crond
```

これで、設定したジョブが指定した時間に実行されるようになります。

## 定期処理の確認

定期処理が正しく実行されているか確認するためには、ログファイルをチェックします。通常、ログは`/data/data/com.termux/files/usr/var/log/cron.log`に保存されます。

```bash
cat /data/data/com.termux/files/usr/var/log/cron.log
```

## まとめ

Termuxでcronieを使用することで、Androidデバイス上で簡単に定期処理を実行できます。これにより、タスクの自動化が可能になり、効率的な作業が実現できます。


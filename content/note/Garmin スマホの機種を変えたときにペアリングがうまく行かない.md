---
title: Garmin スマホの機種を変えたときにペアリングがうまく行かない
date: "2023-06-28T23:35:00+09:00"
tags:
  - '2023/06/28'
  - Garmin
---

スマホの機種変更時に、何度やってもペアリングに成功しなかった。
pinの入力まではできるけど、そのあと failed to pairing と出てエラーとなる。そしてその後はTry againとかをしても即失敗になる。

少し特殊なことをしていて、もともとはPixel 3aとペアリングしていたのだが、Pixel 6(レンタル)に機種変更をして、レンタル期限が来たので再度Pixel 3aに戻そうとしたときにペアリングができなくなってしまった。
なので、完全に新しい機種に変更しようというときにはこんな問題にはならないかもしれない。
昔ペアリングしていた機種に戻そうとするとハマるのかもしれない。

### 公式の手順(失敗)

https://support.garmin.com/ja-JP/?faq=j5tfDRFRWT7q82ipep3bO7
元の機器でペアリングを解除、Garminアプリを削除したあと、新しい機種でペアリングするとだけ書いてあるが、全然解決にならなかった。

### デバイスの削除(失敗)

元の機器でペアリングしなおすのはすんなりできたので、ペアリングしたあとGarmin Connectでデバイスを削除し、新しい機種でペアリング
→ これもうまくいかない

### Bluetoothのキャッシュ削除 

Bluetoothの設定上はGarminが消えているが、キャッシュが残っているせいでペアリングできないことがあるみたいなので、きれいにする

- 設定 > アプリ > 右上の3点リーダ > システムアプリを表示
- Bluetooth アプリを開く
- ストレージを削除(ペアリング済みの機器はきえないので安心)

https://www.reddit.com/r/Garmin/comments/pm9vlu/can_no_longer_connect_to_phone_pairing_failed/

### Garminのソフトリセット

Lightボタンを10秒長押しするとソフトリセットして再起動する

### すべての権限を許可

Garmin Connectのアプリ設定を開いて、すべての必要な権限許可にする


## 結果

上の3つをやって何度かペアリングしなおしたところ成功した。
ちょっとどれが効いたのか、すべてが揃って効いたのかわからない。。

とりあえず暫定の手順としてはこう。
- 元の機種でペアリングを解除
- 新しい機種でBluetoothのキャッシュクリア
- Garminをペアリング状態にする(UP長押し > Phone > Pair phone)
- Garmin Connectを開いて「デバイスを追加」
- Pinを入力
- (これを成功するまで何回か)

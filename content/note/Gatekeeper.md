---
title: Gatekeeper
date: 2023-04-26T20:12:38+09:00
tags:
- 2023/04/26
- Kubernetes
lastmod: 2023-04-30T23:04:13+09:00
---

[Kubernetes](note/Kubernetes.md) でリソースが作成される際にポリシーに適合するかどうかをチェックし、違反する場合は作成させないことができる機構。
ポリシーはRego言語で定義する

* ConstraintTemplateリソースで制約テンプレートを定義 → CRDが作られる
* パラメータを指定してCRDから制約リソースを作成
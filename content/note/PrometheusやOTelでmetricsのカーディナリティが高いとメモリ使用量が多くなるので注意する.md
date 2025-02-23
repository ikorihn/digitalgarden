---
title: PrometheusやOTelでmetricsのカーディナリティが高いとメモリ使用量が多くなるので注意する
date: 2024-12-23T10:54:00+09:00
tags:
  - OpenTelemetry
  - Prometheus
---

attributeにリクエストスコープで取得できる値を軽率に入れたところ、カーディナリティが高くなりメモリ使用量が瀑増した。

参考
[Memory leak with high cardinality tag and MeterFilter meant to cap cardinality · Issue #4971 · micrometer-metrics/micrometer · GitHub](https://github.com/micrometer-metrics/micrometer/issues/4971)

attributeの組み合わせ単位でメトリクスを保持するため、掛け算で大きくなっていく。
メトリクスの作り方に注意して、掛け算にならないよう別のメトリクスとして保持するなどの工夫が必要だった。

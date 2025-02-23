---
title: GitHub Actionsでマージ済みブランチのキャッシュをクリアする
date: 2024-10-18T12:39:00+09:00
tags:
  - GitHubActions
---

キャッシュの最大容量はリポジトリ全体で10GBなので、各ブランチでキャッシュを持っているとあっという間に上限に達して、容量を超えた分が削除されてしまいなんかキャッシュが効かない…ということになりがちです。
そこでマージ済みのブランチは削除するようにしてみます

https://github.com/nocodb/nocodb/pull/5083/files

```yaml
name: cleanup caches by branch
on:
  pull_request:
    types:
      - closed
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        
      - name: Cleanup
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          REPO=${{ github.repository }}
        run: |
          set -x
          gh extension install actions/gh-actions-cache
          
          # get the branch
          BRANCH="refs/pull/${{ github.event.pull_request.number }}/merge"

          # fetch list of cache key
          cacheKeysForPR=$(gh actions-cache list -R $REPO -B $BRANCH | cut -f 1 )

          # set this to not fail the workflow while deleting cache keys
          set +e

          # delete cache key
          for cacheKey in $cacheKeysForPR
          do
              gh actions-cache delete $cacheKey -R $REPO -B $BRANCH --confirm
          done
```
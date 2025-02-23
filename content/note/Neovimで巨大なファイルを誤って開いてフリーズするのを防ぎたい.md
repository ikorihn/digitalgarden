---
title: Neovimで巨大なファイルを誤って開いてフリーズするのを防ぎたい
date: 2024-12-12T15:16:00+09:00
tags:
  - Neovim
---

間違って大きなバイナリファイルを開こうとしてNeovimがクラッシュする、PCが固まるといったことがたまに起こってストレスなので、防ぎたい

## autocommandで巨大ファイルを開く前にチェックする

```lua
-- 完全に開かない場合
local function do_not_open_large_file()
    local max_size = 1 * 1024 * 1024 -- 1 MB
    local file = vim.fn.expand('%:p')
    if vim.fn.getfsize(file) > max_size then
        vim.api.nvim_err_writeln("File too large to open!")
        vim.cmd("bdelete") -- Close the buffer
    end
end

-- 巨大ファイルのときに特定のfeatureをOFFにする場合
local function optimize_for_large_files()
    local max_size = 5 * 1024 * 1024 -- 5 MB
    local file = vim.fn.expand('%:p')
    if vim.fn.getfsize(file) > max_size then
        vim.cmd("setlocal noswapfile noundofile noloadplugins")
        vim.cmd("syntax off")
        vim.api.nvim_err_writeln("Large file detected: Disabling certain features for performance.")
    end
end

vim.api.nvim_create_autocmd("BufReadPre", {
    pattern = "*",
    callback = do_not_open_large_file,
})
```

プラグインでもよい

- Vim [GitHub - vim-scripts/LargeFile: Edit large files quickly (keywords: large huge speed)](https://github.com/vim-scripts/largefile)
- Neovim [GitHub - LunarVim/bigfile.nvim: Make editing big files faster 🚀](https://github.com/LunarVim/bigfile.nvim)

## コマンドライン

ファイルを開く前にサイズをチェックす[]()る

```shell
function _neovim() {
  if [ $(stat -c%s "filename") -lt 10485760 ]; then nvim filename; else echo "File too large to open!"; fi
}
alias nvim=_neovim
```

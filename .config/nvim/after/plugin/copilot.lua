-- vim.keymap.set('i', '<C-/>', '<cmd>copilot#Accept("\\<CR>")<CR>', { silent = true })
vim.g.copilot_no_tab_map = true
vim.cmd[[imap <silent><script><expr> <C-CR> copilot#Accept("\<CR>")]]

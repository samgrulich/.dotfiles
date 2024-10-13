vim.g.copilot_no_tab_map = true
-- vim.keymap.set('i', '<M-\\>', '<cmd>copilot#Accept("\<CR>")<CR>', { silent = true })
vim.cmd[[imap <silent><script><expr> <M-;> copilot#Accept("\<CR>")]]

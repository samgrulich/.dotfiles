local nnoremap = require("theprimeagen.keymap").nnoremap

nnoremap("<leader>pv", "<cmd>Ex<CR>")

-- tabs
-- nnoremap("<leader>nt", "<cmd>tabnew<CR>")

-- windows
nnoremap("<leader>h", "<C-w>h<CR>")
nnoremap("<leader>j", "<C-w>j<CR>")
nnoremap("<leader>k", "<C-w>k<CR>")
nnoremap("<leader>l", "<C-w>l<CR>")

nnoremap("<leader>n", "<C-w>v<cmd>Ex<CR>")
nnoremap("<leader>v", "<C-w>n<cmd>Ex<CR>")

-- horizontal movement 
nnoremap("<C-d>", "<C-d>zz")
nnoremap("<C-u>", "<C-u>zz")

nnoremap("n", "nzzzv")
nnoremap("N", "Nzzzv")
-- nnoremap("<leader>py", "<cmd>!python")


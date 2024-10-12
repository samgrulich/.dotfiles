local nnoremap = require("theprime.keymap").nnoremap

nnoremap("<leader>pv", "<cmd>Ex<CR>")

-- tabs
-- nnoremap("<leader>nt", "<cmd>tabnew<CR>")

-- windows
nnoremap("<leader>h", "<C-w>h<CR>")
nnoremap("<leader>j", "<C-w>j<CR>")
nnoremap("<leader>k", "<C-w>k<CR>")
nnoremap("<leader>l", "<C-w>l<CR>")

nnoremap("<leader>H", "<C-w>H<CR>")
nnoremap("<leader>J", "<C-w>J<CR>")
nnoremap("<leader>K", "<C-w>K<CR>")
nnoremap("<leader>L", "<C-w>L<CR>")

nnoremap("<leader>n", "<C-w>v<cmd>Ex<CR>")
nnoremap("<leader>vn", "<C-w>n<cmd>Ex<CR>")

nnoremap("<leader>sn", "<cmd>sp<CR><C-w>L<CR>")
nnoremap("<leader>sv", "<cmd>sp<CR>")

-- horizontal movement 
nnoremap("<C-d>", "<C-d>zz")
nnoremap("<C-u>", "<C-u>zz")

nnoremap("n", "nzzzv")
nnoremap("N", "Nzzzv")
-- function get_python_path()
--   local path = vim.api.nvim_buf_get_name(0)
--   return path
-- end
-- nnoremap("<leader>py", "<cmd>!python " .. get_python_path() .. "<CR>")

-- fullscreen
nnoremap("<leader>ff", "<C-w>|<C-w>_<CR>")
nnoremap("<leader>fn", "<C-w>|<CR>")
nnoremap("<leader>vn", "<C-w>_<CR>")
nnoremap("<leader>=",  "<C-w>=<CR>")

-- disable copilot 
nnoremap("<leader>0", "<cmd>Copilot disable<CR>")

local set = vim.keymap.set

-- split manipulation
set("n", "<leader>n", "<C-w>v<CR>")
set("n", "<leader>v", "<C-w>n<CR>")
set("n", "<leader>sn", "<C-w>v<cmd>Ex<CR>")
set("n", "<leader>sv", "<C-w>n<cmd>Ex<CR>")

-- set("n", "<leader>h", "<C-w>h")
-- set("n", "<leader>j", "<C-w>j")
-- set("n", "<leader>k", "<C-w>k")
-- set("n", "<leader>l", "<C-w>l")

set("n", "<leader>H", "<C-w>H<CR>")
set("n", "<leader>J", "<C-w>J<CR>")
set("n", "<leader>K", "<C-w>K<CR>")
set("n", "<leader>L", "<C-w>L<CR>")

--resize
set("n", "<C-Up>", "10<C-w>-<CR>")
set("n", "<C-Left>", "10<C-w><<CR>")
set("n", "<C-Right>", "10<C-w>><CR>")
set("n", "<C-Down>", "10<C-w>+<CR>")

set("n", "<leader>ff", "<C-w>|<C-w>_<CR>")
set("n", "<leader>fn", "<C-w>|<CR>")
set("n", "<leader>vn", "<C-w>_<CR>")
set("n", "<leader>=", "<C-w>=<CR>")

-- files
set("n", "<leader>sf", "<cmd>Ex<CR>")

-- centered movement
set("n", "<C-d>", "<C-d>zz")
set("n", "<C-u>", "<C-u>zz")

-- disable copilot
set("n", "<leader>0", "<cmd>Copilot disable<CR>")

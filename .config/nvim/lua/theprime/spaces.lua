local set_indentation = function()
  vim.bo.tabstop = 2
  vim.bo.shiftwidth = 2
  vim.opt.softtabstop = 2
  vim.bo.expandtab = true
end

-- Autocmd for HTML files
vim.api.nvim_create_autocmd("FileType", {
  pattern = "html",
  callback = set_indentation,
})

vim.api.nvim_create_autocmd("FileType", {
  pattern = "javascript",
  callback = set_indentation,
})

vim.api.nvim_create_autocmd("FileType", {
  pattern = "svelte",
  callback = set_indentation,
})

vim.api.nvim_create_autocmd("FileType", {
  pattern = "lua",
  callback = set_indentation,
})

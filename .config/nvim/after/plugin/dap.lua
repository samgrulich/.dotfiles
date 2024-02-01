local dap = require('dap')
local widgets = require('dap.ui.widgets')

dap.adapters.lldb = {
  type = 'executable',
  command = '/usr/bin/lldb-vscode', -- adjust as needed, must be absolute path
  name = 'lldb'
}

dap.configurations.cpp = {
  {
    name = 'Launch',
    type = 'lldb',
    request = 'launch',
    program = function()
      return vim.fn.input('Path to executable: ', vim.fn.getcwd() .. '/', 'file')
    end,
    cwd = '${workspaceFolder}',
    stopOnEntry = false,
    args = {},
  },
}


dap.configurations.rust  = {
  {
    name = 'Rust Launch',
    type = 'lldb',
    request = 'launch',
    program = function()
      -- return vim.fn.input('Path to executable: ', vim.fn.getcwd() .. '/target/debug/', 'file')
      path = vim.fn.getcwd() .. '/target/debug/nikola'
      dap.repl.open()
      -- widgets.sidebar(widgets.frames).open()
      return path 
    end,
    cwd = '${workspaceFolder}',
    stopOnEntry = false,
    args = {},
  },
}


-- If you want to use this for Rust and C, add something like this:
-- dap.configurations.c = dap.configurations.cpp

local nnoremap = require("theprime.keymap").nnoremap

nnoremap("<leader>b", "<cmd>lua require'dap'.toggle_breakpoint()<CR>")
nnoremap("L", "<cmd>lua require'dap.ui.widgets'.hover()<CR>")
nnoremap("<leader>e", "<cmd>lua require'dap'.close()<CR><cmd>lua require'dap'.repl.close()<CR>")
nnoremap("<F5>", "<cmd>lua require'dap'.continue()<CR>")
nnoremap("<F6>", "<cmd>lua require'dap'.step_over()<CR>")
nnoremap("<F7>", "<cmd>lua require'dap'.step_into()<CR>")

-- This file can be loaded by calling `lua require('plugins')` from your init.vim

-- Only required if you have packer configured as `opt`
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  -- Packer can manage itself
  use 'wbthomason/packer.nvim'

  -- Commenting
  use 'numToStr/Comment.nvim'

  -- Navigation
  -- use 'christoomey/vim-tmux-navigator'

  -- Status Line
  use 'nvim-lualine/lualine.nvim'

  -- Colorizer 
  use 'norcalli/nvim-colorizer.lua'

  -- Fuzz finders
  use 'theprimeagen/harpoon'
  use {
    'nvim-telescope/telescope.nvim', branch = '0.1.x',
    requires = {
        'nvim-lua/plenary.nvim',
        'burntsushi/ripgrep',
        'sharkdp/fd'
    }
  }

  use {
      'nvim-treesitter/nvim-treesitter',
  }
  use {
      "windwp/nvim-autopairs",
      event = "InsertEnter",
      config = function()
        require("nvim-autopairs").setup {}
      end
  }
  use('windwp/nvim-ts-autotag')

  -- Error table
  use({
    "folke/trouble.nvim",
    requires = "nvim-tree/nvim-web-devicons",
    config = function()
        require("trouble").setup {
            -- your configuration comes here
        }
      end
  })

  -- Markdown preview
  use({ "iamcco/markdown-preview.nvim", run = "cd app && npm install", setup = function() vim.g.mkdp_filetypes = { "markdown" } end, ft = { "markdown" }, })

  -- Debugging (dap)
  use 'mfussenegger/nvim-dap'
  -- use 'rcarriga/nvim-dap-ui'
  -- use 'theHamsta/nvim-dap-virtual-text'

  -- Github copilot
  -- use 'github/copilot.vim'
  -- use 'zbirenbaum/copilot.lua'

  -- Iron - repl
  use 'Vigemus/iron.nvim'
  -- Jupyter plugins
  use 'goerz/jupytext.nvim'

  -- lsp 
  use {
    'VonHeikemen/lsp-zero.nvim',
    requires = {
        -- LSP Support
        {'neovim/nvim-lspconfig'},
        {'williamboman/mason.nvim'},
        {'williamboman/mason-lspconfig.nvim'},

        -- Autocompletion
        {'hrsh7th/nvim-cmp'},
        {'hrsh7th/cmp-buffer'},
        {'hrsh7th/cmp-path'},
        {'saadparwaiz1/cmp_luasnip'},
        {'hrsh7th/cmp-nvim-lsp'},
        {'hrsh7th/cmp-nvim-lua'},

        -- Snippets
        {'L3MON4D3/LuaSnip'},
        -- Snippet Collection (Optional)
        {'rafamadriz/friendly-snippets'},

        -- nice ui Snippet
        -- lspsaga
    }
  }

  -- colorscheme
  use 'ellisonleao/gruvbox.nvim'
end)

return {
    {"numToStr/Comment.nvim"},
    {"norcalli/nvim-colorizer.lua"},
    {"theprimeagen/harpoon"},
    {
        'nvim-telescope/telescope.nvim', branch = '0.1.x',
        dependencies = {
            'nvim-lua/plenary.nvim',
            'burntsushi/ripgrep',
            'sharkdp/fd'
        }
    },
    { 'nvim-treesitter/nvim-treesitter', },
    {
        "windwp/nvim-autopairs",
        event = "InsertEnter",
        config = function(_, opts)
            require("nvim-autopairs").setup {}
            require'nvim-treesitter.configs'.setup {
                -- A list of parser names, or "all" (the four listed parsers should always be installed)
                ensure_installed = { "c", "lua", "vim", "javascript", "typescript", "rust", "wgsl", "glsl"},

                -- Install parsers synchronously (only applied to `ensure_installed`)
                sync_install = false,

                -- Automatically install missing parsers when entering buffer
                -- Recommendation: set to false if you don't have `tree-sitter` CLI installed locally
                auto_install = true,

                autotag = {
                    enable = true,
                },

                highlight = {
                    -- `false` will disable the whole extension
                    enable = true,

                    -- Setting this to true will run `:h syntax` and tree-sitter at the same time.
                    -- Set this to `true` if you depend on 'syntax' being enabled (like for indentation).
                    -- Using this option may slow down your editor, and you may see some duplicate highlights.
                    -- Instead of true it can also be a list of languages
                    additional_vim_regex_highlighting = false,
                };
            }
        end
    },
    -- Error table
    {
        "folke/trouble.nvim",
        dependencies = "nvim-tree/nvim-web-devicons",
        config = function()
            require("trouble").setup {
                -- your configuration comes here
            }
        end
    },

    -- lsp 
    {
        'VonHeikemen/lsp-zero.nvim',
        dependencies = {
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
        },
        config = function()

            -- Learn the keybindings, see :help lsp-zero-keybindings
            -- Learn to configure LSP servers, see :help lsp-zero-api-showcase
            local lsp_status, lsp = pcall(require, 'lsp-zero')

            if not lsp_status then
                error("couldn't initialize lsp-zero")
                return
            end

            vim.filetype.add {
                extension = {
                    wgsl = "wgsl",
                    frag = "glsl",
                    vert = "glsl",
                    geom = "glsl",
                    tesc = "glsl",
                    tese = "glsl",
                    comp = "glsl",
                }
            }

            lsp.preset('recommended')

            -- lsp.ensure_installed({
            --     -- 'tsserver',
            --     'eslint',
            --     'rust_analyzer',
            --     'wgsl_analyzer'
            -- })

            -- Fix Undefined global 'vim'
            -- lsp.configure('java', {
            -- })

            local cmp_status, cmp = pcall(require, 'cmp')
            if not cmp_status then
                return
            end
            local cmp_select = {behavior = cmp.SelectBehavior.Select}
            local cmp_mappings = lsp.defaults.cmp_mappings({
                ['<C-p>'] = cmp.mapping.select_prev_item(cmp_select),
                ['<C-n>'] = cmp.mapping.select_next_item(cmp_select),
                ['<C-y>'] = cmp.mapping.confirm({ select = true }),
                ['<C-Space>'] = cmp.mapping.complete(),
            })

            -- disable completion with tab
            -- this helps with copilot setup
            -- cmp_mappings['<Tab>'] = nil
            -- cmp_mappings['<S-Tab>'] = nil

            lsp.setup_nvim_cmp({
                mapping = cmp_mappings
            })

            lsp.set_preferences({
                suggest_lsp_servers = false,
                sign_icons = {
                    error = 'E',
                    warn = 'W',
                    hint = 'H',
                    info = 'I'
                }
            })

            lsp.on_attach(function(_, bufnr)
                local opts = {buffer = bufnr, remap = false}

                vim.keymap.set("n", "K", function() vim.lsp.buf.hover() end, opts)
                vim.keymap.set("n", "<leader>vws", function() vim.lsp.buf.workspace_symbol() end, opts)
                vim.keymap.set("n", "<leader>vd", function() vim.diagnostic.open_float() end, opts)
                vim.keymap.set("n", "[d", function() vim.diagnostic.goto_next() end, opts)
                vim.keymap.set("n", "]d", function() vim.diagnostic.goto_prev() end, opts)
                vim.keymap.set("n", "<leader>vca", function() vim.lsp.buf.code_action() end, opts)
                vim.keymap.set("n", "<leader>gd", function() vim.lsp.buf.definition() end, opts)
                vim.keymap.set("n", "<leader>gr", function() vim.lsp.buf.references() end, opts)
                vim.keymap.set("n", "<leader>rn", function() vim.lsp.buf.rename() end, opts)
                vim.keymap.set("i", "<C-h>", function() vim.lsp.buf.signature_help() end, opts)
            end)

            lsp.setup()

            vim.diagnostic.config({
                virtual_text = true,
            })
        end
    }
}

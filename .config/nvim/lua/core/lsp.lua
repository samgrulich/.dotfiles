return {
	{
		"neovim/nvim-lspconfig",
		dependencies = {
			"saghen/blink.cmp",
			"williamboman/mason.nvim",
			"williamboman/mason-lspconfig.nvim",
			{
				"folke/lazydev.nvim",
				opts = {
					library = {
						{ path = "${3rd}/luv/library", words = { "vim%.uv" } },
					},
				},
			},
		},
		config = function()
			-- insert new servers here + config
			-- for the complete list use :h lspconfig-all
			local servers = {
				lua_ls = {},
				pyright = {},
				clangd = {},
				svelte = {},
				tailwindcss = {},
				eslint = {},
				ts_ls = {},
			}

			require("mason").setup()

			local ensure_installed = vim.tbl_keys(servers or {})

			require("mason-lspconfig").setup({ ensure_installed = ensure_installed, automatic_installation = false })
			local capabilities = require("blink.cmp").get_lsp_capabilities()
			require("mason-lspconfig").setup_handlers({
				function(server_name)
					local server = servers[server_name] or {}
					server.capabilities = vim.tbl_deep_extend("force", {}, capabilities, server.capabilities or {})
					require("lspconfig")[server_name].setup(server)
				end,
			})

			require("lspconfig").racket_langserver.setup({})

			vim.api.nvim_create_autocmd("LspAttach", {
				callback = function(args)
					local c = vim.lsp.get_client_by_id(args.data.client_id)
					if not c then
						return
					end
				end,
			})
		end,
	},
}

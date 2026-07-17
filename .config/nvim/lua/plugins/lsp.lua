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
				pyright = {
					-- python = {
					-- 	analysis = {
					-- 		ignore = { "*" },
					-- 	},
					-- },
					-- capabilities = (function()
					-- 	local capabilities = vim.lsp.protocol.make_client_capabilities()
					-- 	capabilities.textDocument.publishDiagnostics.tagSupport.valueSet = { 2 }
					-- 	return capabilities
					-- end)(),
				},
				-- ruff = {},
				clangd = {},
				svelte = {},
				tailwindcss = {},
				eslint = {},
				ts_ls = {},
			}

			require("mason").setup()

			local ensure_installed = vim.tbl_keys(servers or {})

			local capabilities = require("blink.cmp").get_lsp_capabilities()
			for server_name, config in pairs(servers) do
				config.capabilities = vim.tbl_deep_extend("force", {}, capabilities, config.capabilities or {})
				vim.lsp.config(server_name, config)
			end

			require("mason-lspconfig").setup({ ensure_installed = ensure_installed, automatic_installation = false })

			vim.lsp.config("racket_langserver", {})

			vim.api.nvim_create_autocmd("LspAttach", {
				callback = function(args)
					local c = vim.lsp.get_client_by_id(args.data.client_id)
					if not c then
						return
					end
					if c.name == "ruff" then
						c.server_capabilities.hoverProvider = false
					end
				end,
			})
		end,
	},
}

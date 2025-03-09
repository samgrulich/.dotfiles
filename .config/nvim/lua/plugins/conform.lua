return {
	"stevearc/conform.nvim",
	opts = {
		formatters_by_ft = {
			lua = { "stylua" },
			javascript = { "prettier" },
			svelte = { "prettier" },
			nix = { "nixfmt" },
		},
		format_on_save = {
			timeout = 2000,
			lsp_format = "fallback",
		},
		formatters = {
			prettier = { prepend_args = { "--single-quote" } },
		},
	},
}

return {
	{
		"nvim-telescope/telescope.nvim",
		tag = "0.1.8",
		dependencies = {
			"nvim-lua/plenary.nvim",
			{ "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
		},
		config = function()
			require("telescope").setup({
				pickers = {
					find_files = {
						theme = "ivy",
					},
					git_files = {
						theme = "ivy",
					},
				},
				extensions = {
					fzf = {},
				},
			})

			require("telescope").load_extension("fzf")

			vim.keymap.set("n", "<leader>fh", require("telescope.builtin").help_tags, { desc = "Find help" })
			vim.keymap.set("n", "<leader>ff", require("telescope.builtin").find_files, { desc = "Find files" })
			vim.keymap.set("n", "<leader>fg", require("telescope.builtin").git_files, { desc = "Find git files" })
			-- vim.keymap.set("n", "gr", require("telescope.builtin").lsp_references, { desc = "Find git files" })

			-- require("config.telescope.multigrep").setup()
		end,
	},
}

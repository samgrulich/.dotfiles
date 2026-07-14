return {
	{
		"ThePrimeagen/harpoon",
		branch = "harpoon2",
		dependencies = { "nvim-lua/plenary.nvim" },
		keys = {
			{
				"<leader>ha",
				function()
					require("harpoon"):list():add()
				end,
				desc = "Add file to harpoon list",
				mode = "n",
			},
			{
				"<leader>hl",
				function()
					require("harpoon").ui:toggle_quick_menu(require("harpoon"):list())
				end,
				desc = "Toggle harpoon quick menu",
				mode = "n",
			},

			{
				"<leader>hh",
				function()
					require("harpoon"):list():select(1)
				end,
				desc = "Select harpoon file 1",
				mode = "n",
			},
			{
				"<leader>ht",
				function()
					require("harpoon"):list():select(2)
				end,
				desc = "Select harpoon file 2",
				mode = "n",
			},
			{
				"<leader>hn",
				function()
					require("harpoon"):list():select(3)
				end,
				desc = "Select harpoon file 3",
				mode = "n",
			},
			{
				"<leader>hs",
				function()
					require("harpoon"):list():select(4)
				end,
				desc = "Select harpoon file 4",
				mode = "n",
			},

			-- Toggle previous & next buffers stored within harpoon list
			{
				"<leader>hp",
				function()
					require("harpoon"):list():prev()
				end,
				desc = "Select previous harpoon file",
				mode = "n",
			},
			{
				"<leader>hn",
				function()
					require("harpoon"):list():next()
				end,
				desc = "Select next harpoon file",
				mode = "n",
			},
		},
	},
}

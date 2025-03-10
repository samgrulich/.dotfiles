return {
	{
		"nvim-telescope/telescope.nvim",
	},
	{
		"lukas-reineke/indent-blankline.nvim",
		main = "ibl",
		---@module "ibl"
		---@type ibl.config
		opts = {
			indent = { char = { "│", "╎" }, tab_char = { "│", "╎" } },
		},
	},
}

local jupytext = require("jupytext")

local opts = {
  jupytext = 'jupytext',
  format = 'markdown',
  update = true,
  filetype = jupytext.get_filetype,
  new_template = jupytext.default_new_template(),
  sync_patterns = { '*.md', '*.py', '*.jl', '*.R', '*.Rmd', '*.qmd' },
  autosync = true,
  handle_url_schemes = true,
}

jupytext.setup(opts)

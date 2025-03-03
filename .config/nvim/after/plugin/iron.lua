local iron = require "iron.core"
local view = require "iron.view"
local common = require "iron.fts.common"

iron.setup({
  config = {
    should_map_plug = false,
    scratch_repl = true,
    repl_definition = {
      python = {
        command = { "python" },
        format = common.bracketed_paste_python,
      },
      markdown = {
        command = { "ipython" },
        format = common.bracketed_paste,
      }
    },
    -- repl_open_cmd = view.bottom(40),
    repl_open_cmd = {
      view.split.vertical.rightbelow("%40"), -- cmd_1: open a repl to the right
      view.split.rightbelow("%25")  -- cmd_2: open a repl below
    }
  },
  keymaps = {
    send_motion = "ctr",
    visual_send = "ctr",
  },
})

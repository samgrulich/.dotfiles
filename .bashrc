#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
PS1='[\u@\h \W]\$ '
alias config='/usr/bin/git --git-dir=/home/sam/.dotfiles/ --work-tree=/home/sam'
alias vim=nvim
export PATH=$HOME/.cargo/bin:$PATH

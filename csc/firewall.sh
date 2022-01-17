#!/bin/sh

# Script to secure your raspberry pi using ufw.

###################################################################################################################################################################################################
#                                                                                                                                                                                                 #
#                                                                                           Color Codes                                                                                           #
#                                                                                                                                                                                                 #
###################################################################################################################################################################################################

ESET='\033[0m'
YELLOW='\033[1;33m'
#GRAY='\033[0;37m'
#WHITE='\033[1;37m'
GRAY_R='\033[39m'
WHITE_R='\033[39m'
RED='\033[1;31m' # Light Red.
GREEN='\033[1;32m' # Light Green.
#BOLD='\e[1m'

###################################################################################################################################################################################################
#                                                                                                                                                                                                 #
#                                                                                           Start Checks                                                                                          #
#                                                                                                                                                                                                 #
###################################################################################################################################################################################################

header() {
  clear
  clear
  echo -e "${GREEN}#########################################################################${RESET}\\n"
}

header_red() {
  clear
  clear
  echo -e "${RED}#########################################################################${RESET}\\n"
}

# Check for root (SUDO).
if [[ "$EUID" -ne 0 ]]; then
  header_red
  echo -e "${WHITE_R}#${RESET} The script need to be run as root...\\n\\n"
  echo -e "${WHITE_R}#${RESET} For Ubuntu based systems run the command below to login as root"
  echo -e "${GREEN}#${RESET} sudo -i\\n"
  echo -e "${WHITE_R}#${RESET} For Debian based systems run the command below to login as root"
  echo -e "${GREEN}#${RESET} su\\n\\n"
  exit 1
fi

run_apt_get_update() {
  if [[ "${hide_apt_update}" == 'true' ]]; then
    echo -e "${WHITE_R}#${RESET} Running apt-get update..."
    if apt-get update; then echo -e "${GREEN}#${RESET} Successfully ran apt-get update! \\n"; else echo -e "${YELLOW}#${RESET} Something went wrong during running apt-get update! \\n"; fi
    unset hide_apt_update
  fi
  run_apt_get_update
}

header
echo "${GREEN}Welkom bij dit script${RESET}"
clear
clear
sleep 3
hide_apt_update=true
run_apt_get_update
apt install ufw -y

# Block all traffic
ufw default deny incoming
ufw default allow outgoing

# Allowed ports
ufw allow SSH
ufw allow 80
ufw allow 443
ufw allow VNC
ufw allow icmp

# Enable ufw
sudo ufw enable
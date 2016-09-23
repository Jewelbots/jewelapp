#!/usr/bin/env bash
bold=$(tput bold)
reg=$(tput sgr0)

function maybe_node {
	command -v brew >/dev/null 2>&1 || {
		echo "Please visit ${bold}http://brew.sh/${reg} to install Homebrew, and run this script again."
		echo -e "\t- or -"
		echo "Visit ${bold}http://nodejs.org/${reg} to download & install the Node.js binary manually."
		exit 1
	}
	read -p "Would you like to install ${bold}Node.js 4.x LTS${reg} via Brew? [y/N] " -n 1 -r
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		echo
		echo "OK! Beginning brew install now..."
		brew install node4-lts
	else
		echo
		echo "Not installing. Please install Node.js manually, or run this script again."
	fi
}


[[ $(node --version) =~ ([0-9][.][0-9.]*) ]] && version="${BASH_REMATCH[1]}"
if ! awk -v ver="$version" 'BEGIN { if (ver < 4.0) exit 1; }'; then
	command -v nod >/dev/null 2>&1 || {
		echo
		echo >&2 "I need ${bold}Node.js 4.0${reg} or higher installed."
		echo
		maybe_node
	}
else
	printf "Node.js %s detected. ${bold}Very good${reg}! Let's get started...\n\n" "$version"
	echo
	echo "Running npm install..."
	echo
	command -v npm >/dev/null 2>&1 || { echo >&2 "ERROR: Unable to locate npm. Please ensure that npm is installed!"; exit 1; }
	npm install --progress=false
	echo
	echo "Done. Firing it up!"
	echo
	npm link ionic
	npm link osenv
	grunt serve
fi

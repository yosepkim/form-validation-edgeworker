#!/bin/bash

# Download akamai CLI
echo 'Installing akamai CLI'
curl -o akamai https://github.com/akamai/cli/releases/download/v1.5.5/akamai-v1.5.5-linuxamd64
chmod -x akamai

echo 'Setting up .edgerc'
echo -e "[default]\nhost=$(AKAMAI_HOST)\nclient_token=$(AKAMAI_CLIENT_TOKEN)\naccess_token=$(AKAMAI_ACCESS_TOKEN)\nclient_secret=$(AKAMAI_CLIENT_SECRET)" > ~/.edgerc

VERSION=$(grep "edgeworker-version" bundle.json | grep -Eo '[0-9\.]+')
akamai edgeworkers activate $(EW_ID) $(TARGET_ENV) $VERSION --accountkey $(ACCOUNT_KEY)
#!/usr/bin/with-contenv bashio

# Get configuration
PORT=$(bashio::config 'port')
SSL=$(bashio::config 'ssl')

bashio::log.info "Starting HA Floor Plan Editor..."
bashio::log.info "Port: ${PORT}"
bashio::log.info "SSL: ${SSL}"

# Set environment variables
export PORT="${PORT}"
export SSL="${SSL}"

if bashio::config.true 'ssl'; then
    export CERTFILE="/ssl/$(bashio::config 'certfile')"
    export KEYFILE="/ssl/$(bashio::config 'keyfile')"
fi

# Start the application
cd /usr/src/app
exec npm start
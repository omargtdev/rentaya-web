#!/bin/sh
set -e

# Substitute environment variables in nginx config
envsubst '\$API_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Execute the main command
exec "$@"

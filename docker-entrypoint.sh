#!/bin/sh
set -e

# Debug: show the API_URL value
echo "API_URL=${API_URL}"

# Substitute environment variables in nginx config
envsubst '\$API_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp

# Debug: show the substituted config
echo "--- Generated nginx config ---"
cat /etc/nginx/conf.d/default.conf.tmp
echo "--- End nginx config ---"

mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Test nginx config before starting
nginx -t

# Execute the main command
exec "$@"

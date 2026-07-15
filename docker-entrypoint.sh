#!/bin/sh
set -e

# Write runtime config.json so the Angular app knows the backend URL
cat > /usr/share/nginx/html/config.json <<EOF
{"apiUrl":"${API_URL}"}
EOF

echo "API_URL=${API_URL}"
echo "--- Generated config.json ---"
cat /usr/share/nginx/html/config.json
echo "--- End config.json ---"

# Test nginx config before starting
nginx -t

# Execute the main command
exec "$@"

#!/bin/sh

readonly script_dir=$(dirname "$0")

sed -i \
    -e 's#__REACT_APP_AUTH0_DOMAIN__#'"${REACT_APP_AUTH0_DOMAIN}"'#g' \
    -e 's#__REACT_APP_AUTH0_CLIENT_ID__#'"${REACT_APP_AUTH0_CLIENT_ID}"'#g' \
    -e 's#__REACT_APP_DEV_PORT__#'"${REACT_APP_DEV_PORT}"'#g' \
    "${script_dir}/public/env.js"

exec "$@"

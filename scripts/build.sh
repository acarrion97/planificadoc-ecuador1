#!/bin/bash
mkdir -p node_modules/react-native-css-interop/.cache
touch node_modules/react-native-css-interop/.cache/web.css
npx expo export --platform web
cp public/admin.html dist/admin.html
cp public/privacy.html dist/privacy.html
cp public/terms.html dist/terms.html

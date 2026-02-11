# SPA Routing for GitHub Pages
# This script copies index.html to 404.html to handle client-side routing.
# GitHub Pages serves 404.html for any path it doesn't recognize.
cp dist/public/index.html dist/public/404.html

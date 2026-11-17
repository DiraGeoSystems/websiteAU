# The "pages" tag has the github-pages gem with the same Jekyll version that
# GitHub Pages uses to build the live site. "latest" moved to Jekyll 4 in
# November 2026, which broke the dev server.
FROM jekyll/jekyll:pages

WORKDIR /srv/jekyll

EXPOSE 4000

#!/usr/bin/env bash
set -euo pipefail
# Usage: REPO=NeoFantom/quafu-lesson1 ./scripts/publish-github-pages.sh
REPO="${REPO:-NeoFantom/quafu-lesson1}"
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "git@github.com:${REPO}.git"
  BRANCH="${BRANCH:-$(git branch --show-current 2>/dev/null || printf main)}"
  git push -u origin "HEAD:${BRANCH:-main}"
fi
rm -rf /tmp/quafu-lesson-pages
mkdir -p /tmp/quafu-lesson-pages
cp -R site/. /tmp/quafu-lesson-pages/
touch /tmp/quafu-lesson-pages/.nojekyll
git -C /tmp/quafu-lesson-pages init
git -C /tmp/quafu-lesson-pages checkout -b gh-pages
git -C /tmp/quafu-lesson-pages add -A
git -C /tmp/quafu-lesson-pages commit -m "deploy: Quafu lesson tutorial"
git -C /tmp/quafu-lesson-pages remote add origin "git@github.com:${REPO}.git"
git -C /tmp/quafu-lesson-pages push -f origin gh-pages
if ! gh api "repos/${REPO}/pages" >/dev/null 2>&1; then
  printf '{"source":{"branch":"gh-pages","path":"/"}}' | gh api -X POST "repos/${REPO}/pages" --input - >/dev/null
fi
printf 'Published request sent. Check: https://%s.github.io/%s/\n' "${REPO%%/*}" "${REPO#*/}"

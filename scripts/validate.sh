#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="$ROOT/site"
failures=0

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}
pass() {
  printf 'PASS: %s\n' "$1"
}

[ -f "$SITE/index.html" ] || fail "site/index.html exists"
[ -f "$SITE/assets/styles.css" ] || fail "site/assets/styles.css exists"
[ -f "$SITE/assets/app.js" ] || fail "site/assets/app.js exists"
[ -f "$SITE/docs-cn/index.html" ] || fail "site/docs-cn/index.html exists"

if [ -d "$SITE" ]; then
  public_text_files=$(find "$SITE" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.md' \) | sort)

  if grep -RInE '夸父|本源量子云' $public_text_files >/tmp/quafu-forbidden-name.txt 2>/dev/null; then
    cat /tmp/quafu-forbidden-name.txt >&2
    fail "public files use only the Quafu name"
  else
    pass "public files use only the Quafu name"
  fi

  if grep -RInE 'judg(e|ing|ment)|competition review|registration system|竞赛评审|评审系统|报名系统' $public_text_files >/tmp/quafu-forbidden-scope.txt 2>/dev/null; then
    cat /tmp/quafu-forbidden-scope.txt >&2
    fail "public files exclude disallowed competition scope"
  else
    pass "public files exclude disallowed competition scope"
  fi

  if grep -RInE '(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key\s*[:=]\s*["'"'']?[A-Za-z0-9_-]{16,}|token\s*[:=]\s*["'"'']?[A-Za-z0-9_-]{20,}|password\s*[:=])' $public_text_files >/tmp/quafu-secrets.txt 2>/dev/null; then
    cat /tmp/quafu-secrets.txt >&2
    fail "public files contain no credential-looking strings"
  else
    pass "public files contain no credential-looking strings"
  fi

  python3 - "$SITE" <<'PY'
import html.parser
import pathlib
import sys
from urllib.parse import urlparse

site = pathlib.Path(sys.argv[1])
errors = []

class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.hrefs = []
        self.assets = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.hrefs.append(attrs['href'])
        if tag == 'link' and attrs.get('href'):
            self.assets.append(attrs['href'])
        if tag == 'script' and attrs.get('src'):
            self.assets.append(attrs['src'])

for html_file in site.rglob('*.html'):
    parser = LinkParser()
    parser.feed(html_file.read_text(encoding='utf-8'))
    base = html_file.parent
    for asset in parser.assets:
        parsed = urlparse(asset)
        if parsed.scheme or asset.startswith('#'):
            continue
        target = (base / parsed.path).resolve()
        if not target.exists():
            errors.append(f'{html_file.relative_to(site)} missing asset {asset}')
    for href in parser.hrefs:
        parsed = urlparse(href)
        if parsed.scheme or href.startswith('mailto:'):
            continue
        if href.startswith('#'):
            target_file = html_file
            fragment = href[1:]
        else:
            path = parsed.path or '.'
            target = (base / path).resolve()
            target_file = target / 'index.html' if target.is_dir() else target
            fragment = parsed.fragment
        if not target_file.exists():
            errors.append(f'{html_file.relative_to(site)} missing href target {href}')
            continue
        if fragment:
            linked = LinkParser()
            linked.feed(target_file.read_text(encoding='utf-8'))
            if fragment not in linked.ids:
                errors.append(f'{html_file.relative_to(site)} missing anchor {href}')

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
PY
  if [ $? -eq 0 ]; then pass "HTML links and local assets resolve"; fi
fi

[ -d "$ROOT/sources/raw" ] || fail "sources/raw exists"
[ -d "$ROOT/notes" ] || fail "notes exists"
[ -f "$ROOT/notes/integration-points.md" ] || fail "notes/integration-points.md exists"

if [ "$failures" -ne 0 ]; then
  printf 'Validation failed with %s issue(s).\n' "$failures" >&2
  exit 1
fi

printf 'Validation complete.\n'

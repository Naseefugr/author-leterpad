import urllib.request
import re
import os

fonts_dir = "D:/#ChromaDiaries/site/fonts"
os.makedirs(fonts_dir, exist_ok=True)

# Google Fonts CSS URL
css_url = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(css_url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        css = resp.read().decode('utf-8')
    print('Fetched Google Fonts CSS successfully, size:', len(css))
    
    # Extract font file URLs
    urls = re.findall(r'url\((https://[^)]+)\)', css)
    print('Found', len(urls), 'font files to download')
    
    local_css = css
    for idx, u in enumerate(urls):
        ext = 'woff2' if 'woff2' in u else 'ttf'
        fname = f"font_{idx}.{ext}"
        fpath = os.path.join(fonts_dir, fname)
        r = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(r) as font_resp:
            with open(fpath, 'wb') as out_f:
                out_f.write(font_resp.read())
        local_css = local_css.replace(u, f"./fonts/{fname}")
        
    with open("D:/#ChromaDiaries/site/fonts/fonts.css", 'w', encoding='utf-8') as out_css:
        out_css.write(local_css)
    print('All fonts downloaded and fonts.css saved for 100% offline capability!')
except Exception as e:
    print('Failed to download offline fonts:', e)

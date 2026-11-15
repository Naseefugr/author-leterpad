import base64

with open('D:/#ChromaDiaries/site/Base.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

with open('D:/#ChromaDiaries/site/base_image_data.js', 'w', encoding='utf-8') as f:
    f.write('const BASE_IMAGE_DATA = "data:image/png;base64,' + b64 + '";\n')

# Also do margin red for the margin guide overlay!
with open('D:/#ChromaDiaries/site/margin red.png', 'rb') as f:
    b64_margin = base64.b64encode(f.read()).decode('utf-8')

with open('D:/#ChromaDiaries/site/margin_image_data.js', 'w', encoding='utf-8') as f:
    f.write('const MARGIN_IMAGE_DATA = "data:image/png;base64,' + b64_margin + '";\n')

print('Generated base_image_data.js and margin_image_data.js successfully!')

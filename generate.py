#!/usr/local/bin/python
# coding: utf-8

import os, re, urllib3, sqlite3, glob, urllib
from bs4 import BeautifulSoup as bs


api_url = "http://www.redaxo.org/api/master/"

http = urllib3.PoolManager()

response = http.request('GET', api_url)
soup = bs(response.data, "html.parser")

# Datenbank einrichten

db_file = 'redaxo.docset/Contents/Resources/docSet.dsidx'
os.remove(db_file)

conn = sqlite3.connect(db_file)
cur = conn.cursor()

try: cur.execute('DROP TABLE searchIndex;')
except: pass
cur.execute('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);')
cur.execute('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);')


# API-Daten in DB eintragen

categories = soup.find(id="elements").find_all("h3")
entry_types = {
    'Classes': 'Class',
    'Interfaces': 'Interface',
    'Traits': 'Trait',
    'Exceptions': 'Exception',
    'Functions': 'Function'
}
chapters = {
    'methods': 'Method',
    'constants': 'Constant',
    'properties': 'Property'
}
api_docs = []

c1 = categories[2]
c2 = c1.next_sibling.next_sibling.find_all('a')

for cat in categories:
    for link in cat.next_sibling.next_sibling.find_all('a'):
        if link.contents[0].name == 'span':
            name = link.contents[0].contents[0]
        else:
            name = link.contents[0]
        if not re.match(r"apigen", name, re.IGNORECASE):
            cur.execute('INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (?,?,?)', (name, cat.contents[0], link['href']))
            conn.commit()
            api_docs.append(link['href'])

conn.close()

categories_list = [cat.contents[0] for cat in categories]
print(f"Generated database index with {', '.join(categories_list[:-1])} and {categories_list[-1]}")


# Templating

images = set()

template = """
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../Assets/css/styles.css">
  <script src="../Assets/js/script.js"></script>
</head>
<body>%s</body>
</html>
"""

htmlDestPath = "redaxo.docset/Contents/Resources/Documents"
imagesPath = "redaxo.docset/Contents/Resources/Assets/images"

for f in glob.glob('redaxo.docset/Contents/Resources/Documents/*'):
    os.remove(f)

# HTML laden und manipulieren

num_docs_to_process = len(api_docs) * 2
docs_processed = 0

for page in api_docs:

    # Doku laden
    response = http.request('GET', api_url + page)
    doc_soup = bs(response.data, "html.parser")

    # find images
    for i in [img['src'] for img in doc_soup.find_all('img')]:
        images.add(i)

    # ... und URLs anpassen
    for i in doc_soup.find_all('img') :
        i['src'] = '../Assets/images/' + os.path.basename(i['src'])
    page_content = doc_soup.find(id="content")

    for id in chapters:
        docs = doc_soup.find(id=id)
        if docs:
            links_to_sources = docs.find_all("a", title="Go to source code")
            for anchor in links_to_sources:
                anchor['href'] = re.sub(r"^(.*\.html)#(\d+)-(\d+)", r"\1?\2,\3#\2", anchor['href'], 0, re.MULTILINE)
                toc = soup.new_tag("a")
                toc["name"] = f"//apple_ref/cpp/{chapters[id]}/" + urllib.parse.quote_plus(str([child for child in anchor.descendants][-1]))
                toc["class"] = "dashAnchor"
                anchor.insert_before(toc)

    # modifizierte Doku speichern
    target_doc_soup = bs(template % page_content, "html.parser")
    htmlOut = str(target_doc_soup)

    with open("%s/%s" % (htmlDestPath, page), "w") as file:
        file.write(htmlOut)

    # Source laden
    response = http.request('GET', api_url + 'source-' + page)
    source_soup = bs(response.data, "html.parser")
    page_content = source_soup.find(id="source")

    # modifizierten Source speichern
    taret_source_soup = bs(template % page_content, "html.parser")
    htmlOut = taret_source_soup.prettify("utf-8")
    with open("%s/%s" % (htmlDestPath, 'source-' + page), "wb") as file:
        file.write(htmlOut)

    docs_processed += 2

    if (docs_processed % 50 == 0):
        print(f'{docs_processed} of {num_docs_to_process} documents processed')

# Bilder speichern

for i in images:
    response = http.request('GET', api_url + i)
    with open("%s/%s" % (imagesPath, os.path.basename(i)), "wb") as file:
        file.write(response.data)

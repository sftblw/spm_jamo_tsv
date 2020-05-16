## under WTFPL

from wikiextractor import WikiExtractor

import sys

def main():
    sys.argv.extend(['--no_header_footer']) # custom option
    sys.argv.extend(['--doc_namespaces', '0, 1, 3, 4']) # custom option: 0 (doc) 1 (doc talk) 2 (user) 3 (user talk) 4 (wikipedia meta)
    sys.argv.extend(['--no_templates'])
    sys.argv.extend(['--bytes', '1G'])
    sys.argv.extend(['-o', './processed/'])
    sys.argv.append("./kowiki_20200420/kowiki-20200420-pages-meta-current.xml")
    WikiExtractor.main()

if __name__ == "__main__":
    main()
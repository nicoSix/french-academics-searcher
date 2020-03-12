# French academics searcher

This node program is capable of retrieving the results from multiple academics websites and aggregating them to give an overview of the theses and papers being prepared and completed by institution and by thesis director. Consequently, it allows to roughly see the institution and academics working on a given subject.

To use it, make sure that npm, python3 and python3-venv are installed on your computer, then follow those commands:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
npm install
node search.js 
```


Arguments:
- -q / --query (required): researched subject inside databases
- -t / --allintitle: if specified, only academics that appears as authors of papers explicitly containing the keyword will be stored as a result
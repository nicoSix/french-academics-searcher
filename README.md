# Theses.fr parser

This node program is capable of retrieving the results from the theses.fr website, and aggregating them to give an overview of the theses being prepared and completed by institution and by thesis director. Consequently, it allows to roughly see the institution and academics working on a given subject.

To use it, follow those commands:

```
npm install node
node parse.js <your request> <order>
```

Order can be substituted with 'institution' or 'discipline', depending if you prefer to group results by institution or discipline. Results can be pretty-viewed using an online JSON viewer, available on the net.
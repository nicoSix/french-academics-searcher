import scholarly
import sys
import getopt
import json 

def main(argv):
    argument = ''
    usage = 'usage: get_scholar_authors.py -q <query>'
    
    # parse incoming arguments
    try:
        opts, args = getopt.getopt(argv,"hq:",["query="])
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-q", "--query"):
            argument = arg

    search_query = scholarly.search_author('label:blockchain + .fr')
    people = next(search_query)
    res = []
    result_count = 0

    while people:
        res.append(people.__dict__)
        result_count += 1  
        people = next(search_query, False)

    print(json.dumps(res))
    sys.stdout.flush()

if __name__ == "__main__":
    main(sys.argv[1:])
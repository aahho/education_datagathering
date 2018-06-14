from pymongo import MongoClient

client = MongoClient('mongodb://35.154.122.180')
db = client['education']

def insertData(data):
    db.preschool.insert_one(data)


def scrap_data(url):
    pass

if __name__ == '__main__':
    scrap_data("")

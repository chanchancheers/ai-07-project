import psycopg2
import csv
import os



DB_FILEPATH = os.path.join(os.path.dirname(__file__), 'full_data.csv')
host = 'drona.db.elephantsql.com'
user = 'fpiogunw'
password = 'VOKppz8XGACmWU_d-r-U-l7T6daQDscM'
database = 'fpiogunw'

conn = psycopg2.connect(
    host=host,
    user=user,
    password=password,
    database=database
)

cur =conn.cursor()
cur.execute('''SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = 'tttdb';''')

cur.execute('DROP TABLE IF EXISTS passenger')
cur.execute('DROP TABLE IF EXISTS used_car')
cur.execute('''CREATE TABLE used_car (
                carID INTEGER,
                brand VARCHAR(10),
                model VARCHAR(30),
                year INTEGER,
                transmission VARCHAR(20),
                mileage FLOAT(30),
                fuelType VARCHAR(20),
                tax FLOAT(20),
                mpg FLOAT(30),
                engineSize FLOAT(20),
                price INTEGER
                );''')


with open(DB_FILEPATH, 'r') as data:
    reader = csv.reader(data)
    next(reader)
    for row in reader:
        cur.execute(
            '''INSERT INTO used_car (
                carID, brand, model, year, transmission, 
                mileage, fuelType, tax, mpg, engineSize, price)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);''',
                (row[0], row[1], row[2], row[3], row[4], row[5],
                row[6], row[7], row[8], row[9], row[10]))
        
conn.commit()
# cur.execute('EXEC SQL DISCONNECT ALL')
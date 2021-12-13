from flask import Flask, render_template, request
from flask_app.routes import model
import pickle
import os
import pandas as pd

DB_FILEPATH = os.path.join(os.path.dirname(__file__), 'final.pkl')
def byecar():
    app = Flask(__name__)
    app.register_blueprint(model.bp)

    @app.route('/')
    def home():

        return render_template('copied.html')
    
    # @app.route('/result', defaults={})
    @app.route('/result')
    def fueltype(Fuellist=None,Country=None, Transmission=None, Year=None): 
        fueltype = request.args.get('Fuellist')
        country = request.args.get('Country')
        transmission = request.args.get('Transmission')
        year = request.args.get('Year')
        kilo = request.args.get('Kilo')
            

        choices = {"Year": year, 
                    "Country":country, 
                    "Transmission":transmission, 
                    "Fueltype" : fueltype,
                    "Kilo" : kilo,
                    }
        
        test = pd.DataFrame(columns = ['year','transmission','mileage','fuelType','Brand'],
                        data=[(choices['Year'], 
                    choices['Transmission'], 
                    choices['Kilo'],
                    choices['Fueltype'],
                    choices['Country'])])

        pipe = None
        with open(DB_FILEPATH, 'rb') as pickle_file:
            pipe = pickle.load(pickle_file)

        y_pred = pipe.predict(test)
        choices['Price'] = round(y_pred[0])
        return render_template('copied_result.html', result = choices['Price'])


   
    
    
    
    
    
    
    
    
    
    return app

import json

import flask
from flask.json import jsonify
import jinja2
import requests

app = flask.Flask(__name__)
app.jinja_loader = jinja2.ChoiceLoader([
    app.jinja_loader,
    jinja2.FileSystemLoader('.'),
])

data_url = 'https://snapmeter.com/api/v2/531e19848df5cb0b35014e85/meters/2166484536790/bill-summary?token=6d547442-417b-41a3-8838-b022f9c2974d'

@app.route('/', methods=['GET'])
def index():
    resp = requests.get(data_url)
    resp.raise_for_status()

    context = {'data': json.loads(resp.text)}
    return flask.render_template('./index.html', **context)

@app.route('/data.json', methods=['GET'])
def json_data():
    resp = requests.get(data_url)
    resp.raise_for_status()
    return jsonify(resp.json())

if __name__ == '__main__':
    app.run()

from urllib import parse
from flask_cors import CORS
from flask_restful import Api
from flask import Flask, jsonify

import time

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)
api = Api(app)

@app.route("/download/<album_data>")
def download(album_data):
    album_data = eval(album_data)
    res = {}
    for x in album_data:
        #print(f'{x["name"]} - {x["author"]} - {parse.unquote(x["link"])}')
        res[x['link']] = "succeed"
    time.sleep(5)
    return jsonify(res)

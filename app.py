import os
import time

from urllib import parse
from flask_restful import Api
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory



load_dotenv()
MODE = os.getenv("MODE")

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
if MODE == 'dev':
    print('hey')
    from flask_cors import CORS
    CORS(app)
    
api = Api(app)


@app.route('/')
@app.route('/index')
def index():
    print('hey')
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/download/<album_data>", methods=['POST'])
def download(album_data):
    album_data = eval(album_data)
    res = {}
    for x in album_data:
        #print(f'{x["name"]} - {x["author"]} - {parse.unquote(x["link"])}')
        res[x['link']] = "succeed"
    time.sleep(5)
    return jsonify(res)

if __name__ == '__main__':
    app.run()
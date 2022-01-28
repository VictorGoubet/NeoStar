import os
import time
import uuid
import shutil
import subprocess

from urllib import parse
from flask_restful import Api
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory, send_file



load_dotenv()
MODE = os.getenv("MODE")

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
if MODE == 'dev':
    from flask_cors import CORS
    CORS(app)
    
api = Api(app)


@app.route('/')
@app.route('/index')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/download/<album_data>")
def download(album_data):
    album_data = eval(album_data)
    id = uuid.uuid4()
    root = f'{os.path.dirname(os.path.abspath(__file__))}\\download\\{id}'

    res = {'id':id, 'data':{}}
    processes = []
    for x in album_data:
        
        path = f'{root}\\{x["name"]}-{x["author"]}\\'
        command = f'youtube-dl@@-i@@-x@@--audio-format@@mp3@@--yes-playlist@@--no-check-certificate@@--audio-quality@@0@@--add-metadata@@-o@@{path}%(title)s.%(ext)s@@{parse.unquote(x["link"])}' 

        processes.append(subprocess.Popen(command.split('@@')))

    for i, p in enumerate(processes):
        code = p.wait()
        res['data'][album_data[i]['link']] = "fail" if code else "succeed"
    
    shutil.make_archive(root, 'zip', root)
    shutil.rmtree(root, ignore_errors=True)
        
    return jsonify(res)



@app.route("/reset/<id>")
def reset(id):
    time.sleep(10)
    try:
        path = f'{os.path.dirname(os.path.abspath(__file__))}\\download\\{id}.zip'
        os.remove(path)
        res = {'status':True}
    except:
        res = {'status':False}
    return jsonify(res)


@app.route("/send_album/<id>")
def send_album(id):
    path = f'{os.path.dirname(os.path.abspath(__file__))}\\download\\{id}.zip'
    return send_file(path, as_attachment=True)


if __name__ == '__main__':
    app.run()
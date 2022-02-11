import os
import time
import uuid
import shutil
import eventlet
import subprocess

from eventlet import wsgi
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from flask import Flask, jsonify, send_from_directory, send_file



load_dotenv()

if os.getenv("MODE") == 'dev':
    app = Flask(__name__, static_url_path='', static_folder='frontend/build_dev')
    from flask_cors import CORS
    CORS(app)
    socketio = SocketIO(app, cors_allowed_origins="*")
else:
    app = Flask(__name__, static_url_path='', static_folder='frontend/build_prod')
    socketio = SocketIO(app)


@app.route('/')
@app.route('/index')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@socketio.on("connect", namespace='/')
def connect():
    print('New user on the socket')

@socketio.on("disconnect", namespace='/')
def connect():
    print('User disconnected')

@socketio.on("download")
def download(album_data):
    album_data = eval(album_data)
    id = str(uuid.uuid4())
    root = f'{os.path.dirname(os.path.abspath(__file__))}/download/{id}'

    res = {'id':id, 'data':{}}
    processes = []
    for x in album_data:
        
        path = f'{root}/{x["name"]}-{x["author"]}/'
        command = f'youtube-dl@@-i@@-x@@--audio-format@@mp3@@--yes-playlist@@--no-check-certificate@@--audio-quality@@0@@--add-metadata@@-o@@{path}%(title)s.%(ext)s@@{x["link"]}' 

        processes.append(subprocess.Popen(command.split('@@')))

    for i, p in enumerate(processes):
        code = p.wait()
        res['data'][album_data[i]['link']] = "fail" if code else "succeed"
    
    shutil.make_archive(root, 'zip', root)
    shutil.rmtree(root, ignore_errors=True)
    print(res)
    emit('response_download', res)



@app.route("/reset/<id>")
def reset(id):
    time.sleep(10)
    try:
        path = f'{os.path.dirname(os.path.abspath(__file__))}/download/{id}.zip'
        os.remove(path)
        res = {'status':True}
    except:
        res = {'status':False}
    return jsonify(res)


@app.route("/send_album/<id>")
def send_album(id):
    path = f'{os.path.dirname(os.path.abspath(__file__))}/download/{id}.zip'
    return send_file(path, as_attachment=True)


if __name__ == '__main__':
    #app.run(debug=True)
    wsgi.server(eventlet.listen(('https://neostar.herokuapp.com', 5000)), app)
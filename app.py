from flask import Flask, abort, render_template, request
from dimint_client import DiMintClient

app = Flask(__name__)
app.config.from_pyfile('config.cfg')

client = DiMintClient(app.config.get('DIMINT_HOST', '127.0.0.1'),
                      app.config.get('DIMINT_PORT', 5556))


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/monitor')
def monitor():
    if request.is_xhr:
        pass
    return abort(503)


@app.route('/getset')
def getset():
    return abort(503)


@app.route('/get/<path:key>')
def get(key):
    return abort(503)


@app.route('/set', methods=['POST'])
def set():
    return abort(503)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

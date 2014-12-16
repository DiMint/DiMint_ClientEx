import json

from flask import Flask, jsonify, render_template, request
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
    if not request.is_xhr:
        return render_template('monitor.html')
    nodes_state = client.state()
    if isinstance(nodes_state, dict) and 'state' in nodes_state:
        nodes_state = nodes_state['state']
    return jsonify(ok=True, state=nodes_state)


@app.route('/getset')
def getset(set_method=None, set_key=None, set_value=None, result_value=None):
    search_key = request.args.get('search_key')
    search_value = client.get(search_key) if search_key is not None else None
    return render_template('getset.html', search_key=search_key,
                           search_value=search_value, set_method=set_method,
                           set_key=set_key, set_value=set_value,
                           set_result=result_value)


@app.route('/get/<path:key>')
def get(key):
    value = client[key]
    if request.is_xhr:
        return jsonify(ok=True, value=value['value'])
    return render_template('getset.html', search_key=key, search_value=value)


@app.route('/set', methods=['POST'])
def set():
    method = request.form.get('set_method')
    try:
        key = json.loads(request.form.get('set_key'))
    except ValueError:
        key = request.form.get('set_key')
    value = request.form.get('set_value')
    if method == 'set' and value:
        try:
            result_value = client.set(key, json.loads(value))
        except ValueError:
            result_value = client.set(key, value)
    else:
        result_value = None

    return getset(method, key, value, result_value)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

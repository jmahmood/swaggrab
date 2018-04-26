# -*- coding: utf-8 -*-

"""
Swag Grab Server
================

Based on a chat server put together by Kenneth, this app uses Websockets to let a user know if they can get some swag.

It's a last minute screwy thing with no security, just an experiment.

"""
import logging
import os

import gevent
import redis
from flask import Flask, render_template, request, abort, json, jsonify
from flask_cors import cross_origin
from flask_sockets import Sockets

TYPES_OF_SWAG = ['php', 'python', 'ruby', 'postgres', 'kafka']
REDIS_URL = os.environ['REDIS_URL']
REDIS_CHAN = 'chat'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)

redis = redis.from_url(REDIS_URL)


class ChatBackend(object):
    """Interface for registering and updating WebSocket clients."""

    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)


chats = ChatBackend()
chats.start()


def get_redis_button_id(button_id):
    return 'jx_btn_{0}'.format(button_id)


@app.route('/')
def hello():
    return render_template('index.html')


@app.route("/submit_request", methods=['POST'])
@cross_origin(supports_credentials=True)
def submit_request():
    if not request.json or 'button_id' not in request.json or request.json['button_id'] not in TYPES_OF_SWAG:
        abort(400)

    try:
        button_id = request.json['button_id']
        button_actual_id = get_redis_button_id('jx_btn_{0}')
        total = redis.get(button_actual_id)

        if total is None:
            total = 5
        else:
            total = int(total)

        total = total - 1
        if total >= 0:
            logging.warning(total)
            redis.set(button_actual_id, total)
            logging.warning(redis.publish(REDIS_CHAN, json.dumps({'button_id': button_id, 'total': total})))
            return jsonify({'success': True})
    except Exception as e:
        logging.exception(e)

    logging.warning(redis.publish(REDIS_CHAN, json.dumps({'button_id': button_id, 'total': 0})))
    return jsonify({'success': False})


def get_amount_in_redis(button_id):
    # lambda x: 0 if redis.get(get_redis_button_id(x)) is None else redis.get(get_redis_button_id(x))
    redis_button_id = get_redis_button_id(button_id)
    total = redis.get(redis_button_id)
    return 0 if total is None else total


@app.route("/init", methods=['GET'])
@cross_origin(supports_credentials=True)
def init():
    """
    Gets current status for products that are available.
    :return:
    """
    return jsonify(dict([(btn_id, get_amount_in_redis(btn_id)) for btn_id in TYPES_OF_SWAG]))


@sockets.route('/receive')
def outbox(ws):
    """Sends outgoing pubsub messages, via `ChatBackend`."""
    chats.register(ws)

    while not ws.closed:
        # Context switch while `ChatBackend.start` is running in the background.
        gevent.sleep(0.1)

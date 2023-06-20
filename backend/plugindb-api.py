#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, request, jsonify
import pymysql
import json

from flask_cors import CORS, cross_origin, logging


f = open('env.json')
env = json.load(f)
f.close()

app = Flask(__name__)
cors = CORS(app)

logging.getLogger('flask_cors').level = logging.DEBUG


try:
    cnx = pymysql.connect(host='localhost',
                          user=env['username'],
                          password=env['password'],
                          db='plugindb', charset='utf8mb4',
                          cursorclass=pymysql.cursors.DictCursor)

except pymysql.err.OperationalError as e:
    print('Error: %d: %s' % (e.args[0], e.args[1]))
    exit(1)


def map_plugin(plugin_row):
    return {
        "plugin_id": plugin_row['plugin_id'],
        "name": plugin_row['name'],
        "developer_id": plugin_row['developer_id'],
        "developer": plugin_row['developer'],
        "version": plugin_row['version'],

    }


def reduce_plugin(plugin_rows):
    plugin = map_plugin(plugin_rows[0])
    plugin['tags'] = []

    for plugin_row in plugin_rows:
        if plugin_row['tag'] != None:
            plugin['tags'].append(
                {"tag": plugin_row['tag'], "color": plugin_row['tag_color']})

    return plugin


@app.route('/plugin', methods=['GET'])
@cross_origin(origin='*')
def get_all_plugins():
    plugin_map = {}
    try:
        cur = cnx.cursor()
        get_all_plugins_stmt = """
            SELECT p.*, d.name AS developer, t.tag AS tag, t.color AS tag_color
                FROM plugin p
                LEFT JOIN developer d ON d.developer_id = p.developer_id
                LEFT JOIN plugin_tag_map ptm ON ptm.plugin_id = p.plugin_id
                LEFT JOIN tag t ON ptm.tag = t.tag
        """

        cur.execute(get_all_plugins_stmt)

        rows = cur.fetchall()

        for row in rows:
            if row['plugin_id'] not in plugin_map:
                plugin_map[row['plugin_id']] = []

            plugin_map[row['plugin_id']].append(row)

        cur.close()
    except pymysql.Error as e:
        return "Database error", 500

    return jsonify(list(map(reduce_plugin, plugin_map.values())))


@app.route('/sample', methods=['GET'])
def get_all_samples():
    plugins = []
    try:
        cur = cnx.cursor()
        get_all_samples_stmt = "SELECT s.*, sp.name AS sample_pack FROM sample s LEFT JOIN sample_pack sp ON s.sample_pack_id = sp.sample_pack_id"

        cur.execute(get_all_samples_stmt)

        plugins.extend(cur.fetchall())

        cur.close()
    except pymysql.Error as e:
        return "Database error", 500

    return jsonify(plugins)


@app.route('/tag/search', methods=['GET'])
def search_tags():
    query = request.args.get('query')
    try:
        cur = cnx.cursor()
        get_tag_stmt = "SELECT * FROM tag WHERE tag = %s"

        cur.execute(get_tag_stmt, query)

        tag = cur.fetchone()

        if (tag == None):
            return "None found", 404

        cur.close()
        return jsonify(tag)
    except pymysql.Error as e:
        return "Database error", 500


@app.route('/plugin', methods=['POST'])
def create_plugin():
    new_plugin = request.json

    try:
        cur = cnx.cursor()

        cur.callproc(
            'createPlugin', (new_plugin['name'], new_plugin.get('developer'), new_plugin.get('version')))

        id = cur.fetchone()

        if (id == None):
            return "Could not create", 400

        for tag in new_plugin['tags']:
            cur.callproc('tagPlugin', (new_plugin['name'], tag['tag']))

        cur.close()
        cnx.commit()
        return "Created", 200
    except pymysql.Error as e:
        cnx.rollback()
        return "Database error", 500


@app.route('/plugin', methods=['PUT'])
def update_plugin():
    new_plugin = request.json

    try:
        cur = cnx.cursor()

        cur.callproc(
            'updatePlugin', (new_plugin['name'], new_plugin.get('developer'), new_plugin.get('version')))

        cur.callproc('clearPluginTags', (new_plugin['name'],))

        for tag in new_plugin['tags']:
            cur.callproc('tagPlugin', (new_plugin['name'], tag['tag']))

        cur.close()
        cnx.commit()

        return "Updated", 200
    except pymysql.Error as e:
        cnx.rollback()
        return "Database error", 500


# TOOD needed:
# create reducers for tags for samples
# get all presets for plugin
# create sample pack
# create sample
app.run(debug=True)

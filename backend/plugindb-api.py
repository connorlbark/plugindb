#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, request, jsonify
import pymysql
import json

f = open('env.json')
env = json.load(f)
f.close()

app = Flask(__name__)
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
        "version": plugin_row['version'],

    }


def reduce_plugin(plugin_rows):
    plugin = map_plugin(plugin_rows[0])
    plugin['tags'] = []

    for plugin_row in plugin_rows:
        if plugin_row['tag'] != None:
            plugin['tags'].append(plugin_row['tag'])

    return plugin


@app.route('/plugin', methods=['GET'])
def get_all_plugins():
    plugin_map = {}
    try:
        cur = cnx.cursor()
        get_all_plugins_stmt = """
            SELECT p.*, d.name AS developer, ptm.tag
                FROM plugin p
                LEFT JOIN developer d ON d.developer_id = p.developer_id
                LEFT JOIN plugin_tag_map ptm ON ptm.plugin_id = p.plugin_id
        """

        cur.execute(get_all_plugins_stmt)

        rows = cur.fetchall()

        for row in rows:
            if row['plugin_id'] not in plugin_map:
                plugin_map[row['plugin_id']] = []

            plugin_map[row['plugin_id']].append(row)

        cur.close()
    except pymysql.Error as e:
        print(e)
        cnx.close()
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
        cnx.close()
        return "Database error", 500

    return jsonify(plugins)

# TOOD needed:
# create reducers for tags for samples
# get all presets for plugin
# create plugin
# create sample pack
# create sample
# tag plugin
# tag


app.run(debug=True)

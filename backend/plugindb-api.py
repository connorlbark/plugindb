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


def map_sample(sample_row):
    return {
        "sample_id": sample_row['sample_id'],
        "filepath": sample_row['filepath'],
        "sample_pack_id": sample_row['sample_pack_id'],
        "sample_pack_name": sample_row['sample_pack_name'],
        "sample_pack_description": sample_row['sample_pack_description'],
        "sample_pack_url": sample_row['sample_pack_url'],
        "sample_pack_license": sample_row['sample_pack_license'],
    }


def reduce_sample(sample_rows):
    sample = map_sample(sample_rows[0])
    sample['tags'] = []

    for sample_row in sample_rows:
        if sample_row['tag'] != None:
            sample['tags'].append(
                {"tag": sample_row['tag'], "color": sample_row['tag_color']})

    return sample


def map_preset(preset_row):
    return {
        "preset_id": preset_row['preset_id'],
        "name": preset_row['name'],
        "filepath": preset_row['filepath'],
        "plugin_id": preset_row['plugin_id'],
        "plugin_name": preset_row['plugin_name'],
    }


def reduce_preset(preset_rows):
    preset = map_preset(preset_rows[0])
    preset['tags'] = []

    for preset_row in preset_rows:
        if preset_row['tag'] != None:
            preset['tags'].append(
                {"tag": preset_row['tag'], "color": preset_row['tag_color']})

    return preset


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


@app.route('/preset', methods=['GET'])
def get_all_presets():
    preset_map = {}
    try:
        cur = cnx.cursor()
        get_all_presets_stmt = """
        SELECT pr.*, p.name AS plugin_name, t.tag AS tag, t.color AS tag_color
            FROM preset pr
            LEFT JOIN plugin p ON pr.plugin_id = p.plugin_id
            LEFT JOIN preset_tag_map ptm ON ptm.preset_id = pr.preset_id
            LEFT JOIN tag t ON ptm.tag = t.tag
        """

        cur.execute(get_all_presets_stmt)

        rows = cur.fetchall()

        for row in rows:
            if row['preset_id'] not in preset_map:
                preset_map[row['preset_id']] = []

            preset_map[row['preset_id']].append(row)

        cur.close()
    except pymysql.Error as e:
        return "Database error", 500

    return jsonify(list(map(reduce_preset, preset_map.values())))


@app.route('/sample', methods=['GET'])
def get_all_samples():
    sample_map = {}
    try:
        cur = cnx.cursor()
        get_all_samples_stmt = """
        SELECT s.*, sp.name AS sample_pack_name, sp.description AS sample_pack_description,
               sp.url AS sample_pack_url, sp.license AS sample_pack_license, t.tag AS tag, t.color AS tag_color
            FROM sample s
            LEFT JOIN sample_pack sp ON s.sample_pack_id = sp.sample_pack_id
            LEFT JOIN sample_tag_map stm ON stm.sample_id = s.sample_id
            LEFT JOIN tag t ON stm.tag = t.tag
        """

        cur.execute(get_all_samples_stmt)

        rows = cur.fetchall()

        for row in rows:
            if row['sample_id'] not in sample_map:
                sample_map[row['sample_id']] = []

            sample_map[row['sample_id']].append(row)

        cur.close()
    except pymysql.Error as e:
        return "Database error", 500

    return jsonify(list(map(reduce_sample, sample_map.values())))


@app.route('/tag', methods=['GET'])
def get_all_tags():
    try:
        cur = cnx.cursor()
        get_all_tags_stmt = """
        SELECT * FROM tag
        """

        cur.execute(get_all_tags_stmt)

        tags = cur.fetchall()

        cur.close()

        return jsonify(tags)
    except pymysql.Error as e:
        return "Database error", 500


@app.route('/sample_pack', methods=['GET'])
def get_all_sample_packs():
    try:
        cur = cnx.cursor()
        get_all_packs_stmt = """
        SELECT * FROM sample_pack
        """

        cur.execute(get_all_packs_stmt)

        packs = cur.fetchall()

        cur.close()

        return jsonify(packs)
    except pymysql.Error as e:
        return "Database error", 500


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


@app.route('/plugin/<int:plugin_id>', methods=['DELETE'])
def delete_plugin(plugin_id):
    try:
        cur = cnx.cursor()

        cur.execute("DELETE FROM plugin WHERE plugin_id = %s", plugin_id)

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

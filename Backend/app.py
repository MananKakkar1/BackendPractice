from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"])

def init_db():
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL )')
    connection.commit()
    connection.close()

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    if not name or not email:
        return jsonify(status=500, debug='Missing email or name')
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
    connection.commit()
    connection.close()
    return jsonify(status=200)

@app.route('/update-user', methods=['POST'])
def update_user():
    data = request.get_json()
    id = data.get('id')
    name, email = None, None
    if data.get('name'):
        name = data.get('name')
    if data.get('email'):
        email = data.get('email')
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    if name is not None and email is not None:
        cursor.execute('UPDATE users SET name = ?, email = ? WHERE id == ?', (name, email, id))
    elif name is not None and email is None:
        cursor.execute('UPDATE users SET name = ? WHERE id = ?', (name, id))
    else:
        cursor.execute('UPDATE users SET email = ? WHERE id = ?', (email, id))
    connection.commit()
    connection.close()
    return jsonify(status=200, debug='Updated successfully')

@app.route('/get-users', methods=['GET'])
def get_users():
    usersList = []
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    cursor.execute('SELECT id, name, email FROM users')
    rows = cursor.fetchall()
    connection.close()
    for r in rows:
        usersList.append({'id': r[0], 'name': r[1], 'email': r[2]})
    return jsonify(users=usersList, status=200, debug="Successfully get users")

@app.route('/get-user/<int:id>', methods=['GET'])
def get_user(id):
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    cursor.execute('SELECT name, email FROM users WHERE id = ?', (id,))
    row = cursor.fetchone()
    connection.close()
    userInfo = {'id': id, 'name': row[0], 'email': row[1]}
    return jsonify(user=userInfo, status=200, debug="Successfully recieved info")

@app.route('/delete-user/<int:id>', methods=['DELETE'])
def delete_user(id):
    connection = sqlite3.connect('practice.db')
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (id,))
    if cursor.fetchone() is None:
        connection.close()
        return jsonify(status=500, debug='User does not exist')
    cursor.execute('DELETE FROM users WHERE id = ?', (id,))
    connection.commit()
    connection.close()
    return jsonify(status=200, debug='Successfully deleted user')

init_db()
app.run(debug=True)


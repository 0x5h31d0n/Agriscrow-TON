from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import time
import requests

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Create users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('farmer', 'buyer', 'landlord', 'renter')),
            wallet_address TEXT
        )
    ''')
    
    # Create products table with status column
    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            seller_id INTEGER NOT NULL,
            status TEXT DEFAULT 'available' NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users (id)
        )
    ''')
    
    # Add status column if it doesn't exist
    try:
        c.execute('ALTER TABLE products ADD COLUMN status TEXT DEFAULT "available" NOT NULL')
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    # Update any NULL status values to 'available'
    c.execute('UPDATE products SET status = "available" WHERE status IS NULL')
    
    # Create transactions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            buyer_id INTEGER NOT NULL,
            seller_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            transaction_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (buyer_id) REFERENCES users (id),
            FOREIGN KEY (seller_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Check if email exists
        c.execute('SELECT email FROM users WHERE email = ?', (data['email'],))
        if c.fetchone():
            return jsonify({'success': False, 'error': 'Email already registered'}), 400
            
        # Hash password
        hashed_password = generate_password_hash(data['password'])
        
        # Insert user
        c.execute('''
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['email'], hashed_password, data['role']))
        
        conn.commit()
        return jsonify({'success': True}), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get user
        c.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        user = c.fetchone()
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
            
        if not check_password_hash(user[3], data['password']):
            return jsonify({'success': False, 'error': 'Invalid password'}), 401
            
        return jsonify({
            'success': True,
            'data': {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'role': user[4],
                'wallet_address': user[5]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to filename to make it unique
        filename = f"{int(time.time())}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        # Return the URL where the image can be accessed
        image_url = f"http://localhost:5000/uploads/{filename}"
        return jsonify({'success': True, 'url': image_url}), 200
    
    return jsonify({'success': False, 'error': 'Invalid file type'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Product endpoints
@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # First get the seller_id from email
        c.execute('SELECT id FROM users WHERE email = ?', (data['seller_email'],))
        seller = c.fetchone()
        if not seller:
            return jsonify({'success': False, 'error': 'Seller not found'}), 404
            
        seller_id = seller[0]
        
        # Update user's wallet address if provided
        if data.get('seller_wallet'):
            c.execute('''
                UPDATE users 
                SET wallet_address = ? 
                WHERE id = ?
            ''', (data['seller_wallet'], seller_id))
        
        c.execute('''
            INSERT INTO products (
                title, category, price, quantity, unit,
                location, description, image_url, seller_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['title'], data['category'], data['price'],
            data['quantity'], data['unit'], data['location'],
            data.get('description', ''), data.get('image_url', ''),
            seller_id
        ))
        
        conn.commit()
        return jsonify({'success': True, 'id': c.lastrowid}), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get all available products with seller information
        c.execute('''
            SELECT p.*, u.name as seller_name, u.wallet_address as seller_wallet,
                   COALESCE(p.status, 'available') as status
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE COALESCE(p.status, 'available') = 'available'
            ORDER BY p.created_at DESC
        ''')
        
        columns = [desc[0] for desc in c.description]
        products = []
        
        for row in c.fetchall():
            product = dict(zip(columns, row))
            products.append(product)
            
        return jsonify({'success': True, 'data': products}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

# Add new endpoint to update wallet address
@app.route('/api/update-wallet', methods=['POST'])
def update_wallet():
    data = request.json
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        c.execute('''
            UPDATE users 
            SET wallet_address = ? 
            WHERE email = ?
        ''', (data['wallet_address'], data['email']))
        
        conn.commit()
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/ton-price', methods=['GET'])
def get_ton_price():
    try:
        # Fetching TON price from CoinGecko API
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd')
        response.raise_for_status()  # Raises an HTTPError for bad responses

        data = response.json()
        ton_price = data.get('the-open-network', {}).get('usd')  # Adjust based on actual API response structure

        if ton_price is None:
            raise ValueError("TON price not found in response")

        return jsonify({'price': ton_price})

    except requests.exceptions.HTTPError as e:
        app.logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return jsonify({'error': 'Failed to fetch TON price due to HTTP error'}), 500

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Request error: {e}")
        return jsonify({'error': 'Failed to fetch TON price due to request error'}), 500

    except ValueError as e:
        app.logger.error(f"Value error: {e}")
        return jsonify({'error': str(e)}), 500

    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Add new endpoint to record transactions
@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.json
    
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Start transaction
        c.execute('BEGIN TRANSACTION')
        
        try:
            # Get product details
            c.execute('''
                SELECT p.*, u.wallet_address as seller_wallet
                FROM products p
                JOIN users u ON p.seller_id = u.id
                WHERE p.id = ? AND p.status = 'available'
            ''', (data['product_id'],))
            
            product = c.fetchone()
            if not product:
                return jsonify({
                    'success': False,
                    'error': 'Product not available'
                }), 400

            # Insert transaction record
            c.execute('''
                INSERT INTO transactions (
                    product_id, buyer_id, seller_id, amount, 
                    transaction_hash, status
                )
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                data['product_id'], data['buyer_id'], product[9],  # seller_id from product
                data['amount'], data['transaction_hash'], 'completed'
            ))
            
            transaction_id = c.lastrowid
            
            # Update product status to 'sold'
            c.execute('''
                UPDATE products 
                SET status = 'sold' 
                WHERE id = ?
            ''', (data['product_id'],))
            
            # Get transaction details for receipt
            c.execute('''
                SELECT t.*, 
                       p.title as product_title,
                       b.name as buyer_name,
                       s.name as seller_name,
                       s.wallet_address as seller_wallet
                FROM transactions t
                JOIN products p ON t.product_id = p.id
                JOIN users b ON t.buyer_id = b.id
                JOIN users s ON t.seller_id = s.id
                WHERE t.id = ?
            ''', (transaction_id,))
            
            columns = [desc[0] for desc in c.description]
            transaction = dict(zip(columns, c.fetchone()))
            
            # Commit transaction
            conn.commit()
            
            return jsonify({
                'success': True,
                'data': {
                    'transaction': transaction,
                    'message': 'Transaction completed successfully'
                }
            }), 201
            
        except Exception as e:
            # Rollback in case of error
            c.execute('ROLLBACK')
            raise e
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

# Add endpoint to get user's transactions
@app.route('/api/user/transactions/<int:user_id>', methods=['GET'])
def get_user_transactions(user_id):
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get all transactions for the user (both as buyer and seller)
        c.execute('''
            SELECT t.*, p.title as product_title, 
                   b.name as buyer_name, s.name as seller_name
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users b ON t.buyer_id = b.id
            JOIN users s ON t.seller_id = s.id
            WHERE t.buyer_id = ? OR t.seller_id = ?
            ORDER BY t.created_at DESC
        ''', (user_id, user_id))
        
        columns = [desc[0] for desc in c.description]
        transactions = []
        
        for row in c.fetchall():
            transaction = dict(zip(columns, row))
            transactions.append(transaction)
            
        return jsonify({'success': True, 'data': transactions}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

# Add a new endpoint to get farmer's products
@app.route('/api/farmer/products/<int:farmer_id>', methods=['GET'])
def get_farmer_products(farmer_id):
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get all products for the farmer with their status
        c.execute('''
            SELECT p.*, u.name as seller_name, u.wallet_address as seller_wallet,
                   COALESCE(p.status, 'available') as status
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE p.seller_id = ?
            ORDER BY p.created_at DESC
        ''', (farmer_id,))
        
        columns = [desc[0] for desc in c.description]
        products = []
        
        for row in c.fetchall():
            product = dict(zip(columns, row))
            products.append(product)
            
        return jsonify({'success': True, 'data': products}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
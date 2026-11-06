CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL, -- hashed password
        name VARCHAR(255),
        role ENUM ('customer', 'admin') NOT NULL DEFAULT 'customer',
        profile_image VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS styles(
        style_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        detail TEXT ,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS artists (
        artist_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,  
        name VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS featured_artists ( -- put a button to feature or not in front of artist's name in admin panel, if yes then ask for feature image and video
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    feature_image VARCHAR(255), -- this will be put in the hero banner
    feature_video VARCHAR(255), -- this will be put in the 2nd hero banner
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS artworks (
        artwork_id INT AUTO_INCREMENT PRIMARY KEY,
        artist_id INT NOT NULL, 
        style_id INT NOT NULL, -- will tell style kya hai, needed for filters
        title VARCHAR(255) NOT NULL,
        detail TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- for profit calc? and for filters
        first_image_URL VARCHAR(255),
        second_image_URL VARCHAR(255),
        is_available BOOLEAN NOT NULL DEFAULT TRUE, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (artist_id) REFERENCES artists (artist_id) ON DELETE CASCADE,   -- artist is deleted, artworks are too
        FOREIGN KEY (style_id) REFERENCES styles (style_id) ON DELETE RESTRICT -- style wont be deleted until no artwork has it

    );



CREATE TABLE IF NOT EXISTS sizes(
        size_id INT AUTO_INCREMENT PRIMARY KEY,
        name ENUM('A1', 'A2', 'A3') NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS frames(
        frame_id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255),
        material VARCHAR (255), -- for filtering
        image_URL VARCHAR(255), -- svg trasparent
        price DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- this table is for uniquley identifying specific price combo of size+frame+artwork
CREATE TABLE IF NOT EXISTS artwork_variants(
        variant_id INT AUTO_INCREMENT PRIMARY KEY,
        artwork_id INT NOT NULL,
        size_id INT NOT NULL,
        frame_id INT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,    -- will be calculated at backend, left manual so admin can override for discounts etc
        is_available BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (artwork_id) REFERENCES artworks (artwork_id) ON DELETE CASCADE,
        FOREIGN KEY (size_id) REFERENCES sizes (size_id) ON DELETE RESTRICT,
        FOREIGN KEY (frame_id) REFERENCES frames (frame_id) ON DELETE RESTRICT,
        UNIQUE KEY artwork_size_frame (artwork_id, size_id, frame_id)    -- ensure only one artwork-size-frame combo exists
    );

CREATE TABLE IF NOT EXISTS carts(
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE -- customer gaya to cart bhi gyi
    );

CREATE TABLE IF NOT EXISTS cart_items(
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        variant_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (variant_id) REFERENCES artwork_variants (variant_id) ON DELETE RESTRICT,  -- if cart-item is deleted variant still exists (?)             
        FOREIGN KEY (cart_id) REFERENCES carts (cart_id) ON DELETE CASCADE  -- no cart item without cart
    );

CREATE TABLE IF NOT EXISTS orders(
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- set delivery rates at backend using switch cases and add em
        status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE 
    );

CREATE TABLE IF NOT EXISTS order_details(
        order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,  
        variant_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL, -- just the variant price
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (variant_id) REFERENCES artwork_variants(variant_id) ON DELETE RESTRICT,
        FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
    );

-- new
CREATE TABLE IF NOT EXISTS shipping_addresses (
        address_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        street_address TEXT NOT NULL,
        city VARCHAR(255) NOT NULL,
        province VARCHAR(255),
        postal_code VARCHAR(20),
        country VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );


CREATE TABLE IF NOT EXISTS payments (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        method ENUM('credit_card', 'bank_transfer', 'paypal', 'cash_on_delivery') NOT NULL,
        transaction_id VARCHAR(255), -- from dummy payment gateway
        status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
        paid_at DATETIME DEFAULT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reviews(
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        artwork_id INT NOT NULL,
        rating TINYINT,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT rating_ck CHECK (rating BETWEEN 1 AND 5),    -- why didnt i use enum here
        FOREIGN KEY (artwork_id) REFERENCES artworks (artwork_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        UNIQUE KEY user_artwork_review (user_id, artwork_id)    -- 1 user cant spam same review on an artwork
    );

-- for gallery preview functionality 
CREATE TABLE IF NOT EXISTS room_backgrounds(
        room_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        dominant_color VARCHAR(32) NOT NULL,    -- hexcode (?) manual entry cuz aint nobody got time or skill or openCV rn
        image_URL VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS room_frames (
    room_frame_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    size_id INT NOT NULL,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room_backgrounds(room_id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(size_id) ON DELETE RESTRICT
);

-- ----------------------
-- admin stuff
CREATE TABLE IF NOT EXISTS analytics(
        log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        session_id varchar(255),
        user_id INT NULL,
        action ENUM('view_page', 'view_artwork', 'add_to_cart', 'checkout', 'review_submitted', 'preview_gallery') NOT NULL,
        artwork_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
        FOREIGN KEY (artwork_id) REFERENCES artworks (artwork_id) ON DELETE SET NULL
    );
    
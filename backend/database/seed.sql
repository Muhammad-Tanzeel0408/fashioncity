-- ============================================
-- FashionCity Seed Data
-- ============================================
-- Run AFTER schema.sql in your Supabase SQL Editor
-- ============================================

-- ============================================
-- INSERT CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, image_url, display_order) VALUES
  ('Men', 'men', 'Premium men''s clothing collection', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 1),
  ('Women', 'women', 'Elegant women''s fashion collection', 'https://images.unsplash.com/photo-1597122745879-34f2a8db1e6a?w=600', 2),
  ('Kids', 'kids', 'Adorable kids'' clothing collection', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', 3),
  ('Summer', 'summer', 'Beat the heat with our summer collection', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600', 4),
  ('Winter', 'winter', 'Stay warm with our winter essentials', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', 5),
  ('Stitched', 'stitched', 'Ready-to-wear stitched clothing', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', 6),
  ('Unstitched', 'unstitched', 'Premium unstitched fabric collection', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', 7);

-- ============================================
-- INSERT SAMPLE PRODUCTS
-- ============================================
INSERT INTO products (name, slug, description, price, sale_price, images, category_id, sizes, colors, stock, is_featured) VALUES
  (
    'Classic Cotton Polo - Navy',
    'classic-cotton-polo-navy',
    'Premium cotton polo shirt with a classic fit. Perfect for casual and semi-formal occasions. Features a ribbed collar and two-button placket.',
    2500.00,
    1999.00,
    ARRAY['https://images.unsplash.com/photo-1625910513413-5fc08ef5e4b9?w=600'],
    (SELECT id FROM categories WHERE slug = 'men'),
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Navy', 'White', 'Black'],
    50,
    true
  ),
  (
    'Slim Fit Chino Pants - Khaki',
    'slim-fit-chino-pants-khaki',
    'Tailored slim-fit chino pants in a versatile khaki color. Comfortable stretch fabric with a modern silhouette.',
    3200.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
    (SELECT id FROM categories WHERE slug = 'men'),
    ARRAY['28', '30', '32', '34', '36'],
    ARRAY['Khaki', 'Black', 'Navy'],
    35,
    false
  ),
  (
    'Embroidered Lawn Suit - Rose',
    'embroidered-lawn-suit-rose',
    'Beautiful embroidered lawn suit with delicate floral patterns. Includes shirt, dupatta, and trouser fabric.',
    4500.00,
    3800.00,
    ARRAY['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'],
    (SELECT id FROM categories WHERE slug = 'women'),
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Rose', 'Blue', 'Green'],
    25,
    true
  ),
  (
    'Silk Dupatta - Gold',
    'silk-dupatta-gold',
    'Hand-woven silk dupatta with intricate gold border work. Adds elegance to any outfit.',
    1800.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    (SELECT id FROM categories WHERE slug = 'women'),
    ARRAY['Free Size'],
    ARRAY['Gold', 'Maroon', 'Teal'],
    40,
    false
  ),
  (
    'Kids Printed T-Shirt - Blue',
    'kids-printed-tshirt-blue',
    'Fun and colorful printed t-shirt for kids. Made from soft, breathable cotton that is gentle on skin.',
    999.00,
    799.00,
    ARRAY['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600'],
    (SELECT id FROM categories WHERE slug = 'kids'),
    ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    ARRAY['Blue', 'Red', 'Yellow'],
    60,
    true
  ),
  (
    'Kids Denim Shorts',
    'kids-denim-shorts',
    'Durable denim shorts for active kids. Features an elastic waistband for easy wear.',
    1200.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1560506840-ec148e82a604?w=600'],
    (SELECT id FROM categories WHERE slug = 'kids'),
    ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    ARRAY['Blue', 'Light Blue'],
    45,
    false
  ),
  (
    'Linen Summer Shirt - White',
    'linen-summer-shirt-white',
    'Lightweight linen shirt perfect for hot summer days. Features a relaxed fit with roll-up sleeves.',
    2800.00,
    2200.00,
    ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
    (SELECT id FROM categories WHERE slug = 'summer'),
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['White', 'Sky Blue', 'Peach'],
    30,
    true
  ),
  (
    'Cotton Summer Dress - Floral',
    'cotton-summer-dress-floral',
    'Breezy cotton dress with beautiful floral print. Perfect for brunches and day outings.',
    3500.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    (SELECT id FROM categories WHERE slug = 'summer'),
    ARRAY['S', 'M', 'L'],
    ARRAY['Floral', 'Yellow', 'Pink'],
    20,
    false
  ),
  (
    'Wool Blend Overcoat - Charcoal',
    'wool-blend-overcoat-charcoal',
    'Premium wool-blend overcoat for harsh winters. Features a classic lapel collar and deep pockets.',
    8500.00,
    6999.00,
    ARRAY['https://images.unsplash.com/photo-1544923246-77307dd270b4?w=600'],
    (SELECT id FROM categories WHERE slug = 'winter'),
    ARRAY['M', 'L', 'XL', 'XXL'],
    ARRAY['Charcoal', 'Black', 'Camel'],
    15,
    true
  ),
  (
    'Fleece Hoodie - Burgundy',
    'fleece-hoodie-burgundy',
    'Warm fleece pullover hoodie with a kangaroo pocket. Cozy and stylish for winter layering.',
    3200.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
    (SELECT id FROM categories WHERE slug = 'winter'),
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Burgundy', 'Olive', 'Grey'],
    28,
    false
  ),
  (
    'Ready-Made Kurta Shalwar - Cream',
    'readymade-kurta-shalwar-cream',
    'Elegant ready-made kurta shalwar set in premium cotton. Perfect for formal and festive occasions.',
    5500.00,
    4500.00,
    ARRAY['https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600'],
    (SELECT id FROM categories WHERE slug = 'stitched'),
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['Cream', 'White', 'Sky Blue'],
    22,
    true
  ),
  (
    'Unstitched Lawn 3-Piece - Emerald',
    'unstitched-lawn-3piece-emerald',
    'Premium unstitched lawn fabric with embroidered front, printed back, and chiffon dupatta.',
    3800.00,
    2999.00,
    ARRAY['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600'],
    (SELECT id FROM categories WHERE slug = 'unstitched'),
    ARRAY['Free Size'],
    ARRAY['Emerald', 'Magenta', 'Royal Blue'],
    35,
    true
  );

-- ============================================
-- INSERT DEFAULT ADMIN
-- ============================================
-- Password: admin123 (bcrypt hashed)
-- CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!
INSERT INTO admins (name, email, password_hash) VALUES
  ('Admin', 'admin@fashioncity.com', '$2a$10$XQxBj9HMaJwIJlPOGQbP3e8wJ/5g3ZPkQMPx3JfXPkPFzKH3Z/q.2');

-- NOTE: The default admin password hash above is a placeholder.
-- To generate a valid hash, use the /api/admin/setup endpoint once,
-- or run: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
-- Then update the hash in this INSERT statement.

export const queryCatIndex =
    `
    SELECT categories.id, categories.name, categories.description 
    FROM categories;
    `

export const queryCatShow =
    `
    SELECT categories.id, categories.name, categories.description 
    FROM categories
    WHERE categories.id = ?;
    `

export const queryInvoiceIndex =
    `
    SELECT
            invoices.*,
            users.name,
            users.surname,
            users.mail,
            users.address,
            users.phone,
            products.name AS product_name,
            products.slug,
            products.price,
            products.img,
            product_invoice.qty,
            product_invoice.paid

        FROM invoices

        JOIN users
            ON users.id_invoice = invoices.id

        JOIN product_invoice
            ON product_invoice.id_invoice = invoices.id

        JOIN products
            ON products.id = product_invoice.id_product;
    `

export const queryInvoiceShow =
    `
    SELECT
            invoices.*,
            users.name,
            users.surname,
            users.mail,
            users.address,
            users.phone,
            products.name AS product_name,
            products.price,
            products.img,
            product_invoice.qty,
            product_invoice.paid

        FROM invoices

        JOIN users
            ON users.id_invoice = invoices.id

        JOIN product_invoice
            ON product_invoice.id_invoice = invoices.id

        JOIN products
            ON products.id = product_invoice.id_product

        WHERE invoices.id = ?;
    `


export const queryProductIndex =
    `
    SELECT 
        products.id,
        products.name, 
        products.description, 
        products.slug, 
        products.img, 
        products.price, 
        products.discount,
        products.created_at,
        categories.name as category  
    FROM products
    JOIN product_category AS pc
        ON pc.id_product = products.id
    JOIN categories
        ON categories.id = pc.id_category
    WHERE 1=1`

export const queryProductsFive =
    `SELECT 
        products.id,
        products.name, 
        products.description, 
        products.slug, 
        products.img, 
        products.price, 
        products.discount,
        products.created_at,
        categories.name as category  
    FROM products
    JOIN product_category AS pc
        ON pc.id_product = products.id
    JOIN categories
        ON categories.id = pc.id_category
    ORDER BY products.created_at
    LIMIT 5;
    `

export const queryProductShow =
    `
    SELECT 
        products.id,
        products.name, 
        products.description, 
        products.slug, 
        products.img, 
        products.price, 
        products.discount,
        products.created_at,
        categories.name as category 
    FROM products
    JOIN product_category AS pc
        ON pc.id_product = products.id
    JOIN categories
        ON categories.id = pc.id_category
    WHERE products.slug = ?;
    `


export const queryUserIndex =
    `
    SELECT 
        users.id, 
        users.name, 
        users.surname, 
        users.mail, 
        users.address, 
        users.phone 
    FROM users;
    `


export const queryUserShow =
    `
    SELECT 
        users.id, 
        users.name, 
        users.surname, 
        users.mail, 
        users.address, 
        users.phone 
    FROM users 
    WHERE users.id = ?;
    `

export const querySelectSlugs =
    `SELECT p.slug
    FROM products p;`


export const insertInvoice =
    `
    INSERT INTO invoices (total_amount, status, shipping_cost, tracking_number, payment_method)
    VALUES (?, ?, ?, ?, ?);
    `


export const insertUser = 
    `
    INSERT INTO users (id_invoice, name, surname, mail, address, phone)
    VALUES (?, ?, ?, ?, ?, ?);
    `

export const insertOrder = 
    `
    INSERT INTO product_invoice (id_product, id_invoice, paid, qty)
    VALUES (?, ?, ?, ?);
    `

export const categoryCheckQuery = 
    `
    SELECT id, name
    FROM categories
    WHERE  id = ? 
    `

export const queryProductsBySlugs = `
    SELECT id, name, price, slug
    FROM products 
    WHERE slug IN (?);
`;
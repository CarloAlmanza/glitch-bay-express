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
    SELECT * 
    FROM invoices 
    ORDER BY invoices.created_at DESC;
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
        ON categories.id = pc.id_category;
    `

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
    WHERE products.discount = 0
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
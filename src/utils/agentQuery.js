
export const queryProductsClaude = `
    SELECT 
        products.name, 
        products.description, 
        products.slug, 
        products.price, 
        products.discount,
        categories.name as category  
    FROM products
    JOIN product_category AS pc
        ON pc.id_product = products.id
    JOIN categories
        ON categories.id = pc.id_category
`

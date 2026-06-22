function normalizingProducts(productsArray) {

    return productsArray.map(product => {
        const { 
            id, 
            name, 
            description, 
            slug, 
            img, 
            price, 
            discount, 
            created_at, 
            updated_at,
            category 
        } = product;

        return {
            id,
            name,
            description,
            slug,
            category,
            img: img ? `http://localhost:3000/${img}` : "https://placehold.co/600x400/png",
            price: Number(price),
            discount,
            created_at: created_at ? new Date(created_at).toLocaleDateString('it-IT') : null,
            updated_at: updated_at ? new Date(updated_at).toLocaleDateString('it-IT') : null,
        };
    });
}

export default normalizingProducts;
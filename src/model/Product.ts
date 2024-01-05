const fs = require("fs");

// PRODUCT INTERFACE
interface IProduct {
    id: string;
    name: string;
    cost: number;
};

// GET ALL PRODUCTS
export const getAllProducts = function ():Promise<IProduct[]> {

    return new Promise((resolve, reject) => {

        fs.readFile(`${__dirname}/../db/productDB.txt`, (err: NodeJS.ErrnoException | null, data: string) => {

            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }

            let productsJSON = JSON.parse(data.toString());
            resolve(productsJSON);
        });
    });
};

// GET PRODUCT BY ID
export const getProductById = async function(productId:number):Promise<IProduct | undefined> {

    // GETTING ALL PRODUCTS
    const products = await getAllProducts();

    // FINDING PRODUCT WITH SPECIFIED ID
    const product = products?.find(singleProduct => +singleProduct.id === +productId);

    // RETURN THAT PRODUCT
    return product;
};
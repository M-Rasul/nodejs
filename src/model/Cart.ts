const fs = require("fs");

// PRODUCT INTERFACE
interface IProduct {
    id: number;
    amount: number;
};

// CART INTERFACE
interface ICart {
    id: number;
    userId: number;
    products: IProduct[];
};

// CREATE
export const createCart = async function(productId: number, amount: number, userId: number):Promise<ICart> {

    // ID OF A CART
    const id = await getTheLastCartId();

    // CART TO BE PUSHED
    const cart = {
        id: id + 1,
        userId,
        products: [{id: productId, amount}]
    };

    // GET ALL CARTS
    const carts = await getAllCarts();

    // PUSH NEW CART TO OLD LIST
    carts.push(cart);

    // WRITE CARTS TO THE FILE
    fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(carts), (err: NodeJS.ErrnoException | null) => {
        if(err) {
            console.log("Failed to write to file");
        }   
    });

    // RETURN CREATED CART
    return cart;
};

// UPDATE CART
export const updateCart = async function(productId: number, amount: number, cartId: number):Promise<ICart[]> {
    
    // FIND THAT CART
    const cart = await getCartById(cartId);
    
    // GET ALL CARTS
    const carts:ICart[] = await getAllCarts();

    // DOES PRODUCT EXIST IN THAT CART
    const isProductInCart = cart?.products.some(product => product.id === productId);

    const newCarts = carts.map(singleCart => {
        if(singleCart.id === cartId) {
            if(isProductInCart) {
                return {...singleCart, products: singleCart.products.map(singleProduct => {
                    if(singleProduct.id === productId) {
                        return {...singleProduct, amount: +singleProduct.amount + (+amount)};
                    }
                    return singleProduct;
                })}
            } else {
                return {...singleCart, products: [...singleCart.products, {id: productId, amount}]};
            }
        }
        return singleCart;
    })

    // WRITE TO FILE
    fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(newCarts), (err: NodeJS.ErrnoException | null) => {

        // IF ERROR
        if(err) {
            console.log("Failed to write to file");
        }
    });

    // RETURN NEW CARTS
    return newCarts;
};

// GET THE LAST CART'S ID
export const getTheLastCartId = async function():Promise<number> {
    
    // GET CARTS
    const carts:ICart[] = await getAllCarts();

    // RETURN ID
    if(carts.length) {
        return carts[carts.length - 1].id;
    } else {
        return 0;
    }
}

// GET ALL CARTS
export const getAllCarts = function ():Promise<ICart[]> {

    return new Promise((resolve, reject) => {

        fs.readFile(`${__dirname}/../db/cartDB.txt`, (err: NodeJS.ErrnoException | null, data: string) => {

            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }

            let cartsJSON = JSON.parse(data.toString());
            resolve(cartsJSON);
        });
    });
};

// GET CART BY ID
export const getCartById = async function(cartId:number):Promise<ICart | undefined> {

    // GETTING ALL CARTS
    const carts = await getAllCarts();

    // FINDING CART WITH SPECIFIED ID
    const cart = carts?.find(singleCart => singleCart.id === cartId);

    // RETURN THAT CART
    return cart;
};

// DELETE CART
export const deleteCart = async function(cartId: number):Promise<ICart[]> {

    // GET ALL CARTS
    const carts = await getAllCarts();

    // FILTER CARTS WITHOUT THAT CART
    const newCarts = carts.filter(cart => cart.id !== cartId).map((filteredCart, index) => ({...filteredCart, id: index}));

    // WRITE CARTS TO FILE
    fs.writeFile(`${__dirname}/../db/cartDB.txt`, JSON.stringify(newCarts), (err: NodeJS.ErrnoException | null) => {
        if(err) {
            console.log("Failed to write to file");
        }   
    });

    // RETURN CARTS
    return newCarts;
};
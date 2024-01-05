const fs = require("fs");

// PRODUCT INTERFACE
interface IProduct {
    id: string;
    name: string;
    cost: number;
    amount: number;
};

// ORDER INTERFACE
interface IOrder {
    id: number;
    userId: number;
    cost: number;
    products: IProduct[];
};

// CREATE ORDER
export const createOrder = async function(orders:IOrder[]):Promise<IOrder> {

    // WRITE THE ORDER TO FILE
    fs.writeFile(`${__dirname}/../db/orderDB.txt`, JSON.stringify(orders), (err: NodeJS.ErrnoException | null) => {
        if(err) {
            console.log("Failed to write to file");
        }   
    });

    // RETURN CREATED ORDER
    return orders[orders.length - 1];
};

// GET ALL ORDERS
export const getAllOrders = function():Promise<IOrder[]> {
    
    return new Promise((resolve, reject) => {

        fs.readFile(`${__dirname}/../db/orderDB.txt`, (err: NodeJS.ErrnoException | null, data: string) => {

            if (err) {
                console.log("Failed to open the file");
                reject(err);
            }

            let ordersJSON = JSON.parse(data.toString());
            resolve(ordersJSON);
        });
    });
};

// GET THE LAST ORDER ID
export const getLastOrderId = async function():Promise<number> {

    // GET CARTS
    const orders:IOrder[] = await getAllOrders();

    // RETURN ID
    if(orders.length) {
        return orders[orders.length - 1].id;
    } else {
        return 0;
    }
};
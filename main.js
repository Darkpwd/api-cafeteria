const express = require('express');
const app = express();
const uuid = require('uuid');
const port = 3000;

app.use(express.json());

const orders = [];

const routesMiddleware = (req, res, next) =>{
    const {id} = req.params;
    const orderIndex = orders.findIndex(order => order.id === id);

    if(orderIndex < 0){
        return res.status(404).json({error: "Desculpe, pedido não encontrado!"})
    }

    req.orderIndex = orderIndex;
    req.order = orders[orderIndex];

    next()

}

app.get('/orders', (req, res) =>{
    return res.status(200).json(orders)
})


app.post('/orders', (req, res) =>{
    const {name, order, price} = req.body;
    const orderID = {id: uuid.v4(), name, order, price};

    orders.push(orderID);

    return res.status(201).json(orders)
})


app.put('/orders/:id', routesMiddleware,(req, res) =>{
    const {name, order, price}= req.body;
    
    const updateOrder = {...req.order, name, order, price};
    orders[req.orderIndex] = updateOrder;

    return res.status(201).json(updateOrder);
})

app.patch('/orders/:id', routesMiddleware,(req, res) =>{
    const {id} = req.params;


    const orderIndex = orders.findIndex(order => order.id === id);

    if(orderIndex < 0){
        return res.status(404).json({error: "Desculpe, pedido não encontrado!"})
    }

    const orginalOrder = orders[orderIndex]

    const updatedOrder  = {
        ...orginalOrder,
        status: "Pronto!"
    }

    orders[orderIndex] = updatedOrder



    return res.status(201).json(updatedOrder);
})

app.delete('/orders/:id', routesMiddleware,(req, res) =>{

    orders.splice(req.orderIndex, 1)

    return res.status(204).send();
})






app.listen(port, () =>{
    console.log('Ok', port)
})
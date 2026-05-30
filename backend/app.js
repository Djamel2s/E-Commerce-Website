const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
cors({
  origin: "http://localhost:5173",
});

items = [
  {
    id: "1",
    name: "Example Item",
    description: "Description here",
    price: 9.99,
    image_url: "http://example.com/image.jpg",
  },
  {
    id: "2",
    name: "Item 2",
    description: "Description for Item 2",
    price: 19.99,
    image_url: "http://example.com/image2.jpg",
  },
  {
    id: "3",
    name: "Item 3",
    description: "Description for Item 3",
    price: 29.99,
    image_url: "http://example.com/image3.jpg",
  },
  {
    id: "4",
    name: "Item 4",
    description: "Description for Item 4",
    price: 39.99,
    image_url: "http://example.com/image4.jpg",
  },
  {
    id: "5",
    name: "Item 5",
    description: "Description for Item 5",
    price: 49.99,
    image_url: "http://example.com/image5.jpg",
  },
  {
    id: "6",
    name: "Item 6",
    description: "Description for Item 6",
    price: 59.99,
    image_url: "http://example.com/image6.jpg",
  },
  {
    id: "7",
    name: "Item 7",
    description: "Description for Item 7",
    price: 69.99,
    image_url: "http://example.com/image7.jpg",
  },
];

cartitems = [
  {
    id: "1",
    itemId: "1",
    quantity: 1,
  },
  {
    id: "2",
    itemId: "2",
    quantity: 2,
  },
  {
    id: "3",
    itemId: "3",
    quantity: 3,
  },
];

cart = {
  cartid: "1",
  userid: "1",
  items: cartitems,
};

app.use(express.json());

app.get("/items", (req, res) => {
  res.status(200).json(items);
});

app.get("/items/:itemId", (req, res) => {
  const item = items.find((i) => i.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.status(200).json(item);
});

app.post("/cart", (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || !quantity) {
    return res
      .status(400)
      .json({ error: "Missing itemId or quantity in request body" });
  }
  if (!items.find((i) => i.id === itemId)) {
    return res.status(404).json({ error: "Item not found" });
  }
  const newCartItem = {
    id: cartitems.length + 1,
    itemId,
    quantity,
  };
  cartitems.push(newCartItem);
  res.status(201).json(newCartItem);
});

app.put("/cart/:cartitemId", (req, res) => {
  const { quantity } = req.body;
  if (!quantity) {
    return res.status(400).json({ error: "Missing quantity in request body" });
  }
  const cartItem = cartitems.find((i) => i.id === req.params.cartitemId);
  if (!cartItem) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  cartItem.quantity = quantity;
  res.status(200).json(cartItem);
});

app.delete("/cart/:cartitemId", (req, res) => {
  const cartItemIndex = cartitems.findIndex(
    (i) => i.id === req.params.cartitemId,
  );
  if (cartItemIndex === -1) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  cartitems.splice(cartItemIndex, 1);
  res.status(204).send();
});

/*
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/cars", (req, res) => {
  res.json(cars);
});

app.post("/cars", (req, res) => {
  if (!req.body.id || !req.body.name) {
    return res
      .status(400)
      .json({ error: "Missing id or name in request body" });
  }
  const newCar = {
    id: cars.length + 1,
    name: req.body.name,
  };
  cars.push(newCar);
  res.status(201).json(newCar);
});
*/

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

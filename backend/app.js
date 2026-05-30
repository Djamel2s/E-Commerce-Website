const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

items = [
  {
    id: 1,
    name: "Sneakers Urban Flow",
    description:
      "Lightweight everyday sneakers with breathable mesh and all-day comfort.",
    price: 79.99,
    image_url: "https://picsum.photos/seed/sneakers-urban-flow/900/600",
  },
  {
    id: 2,
    name: "CityPack Backpack",
    description:
      "Minimal 20L backpack with a 15-inch laptop compartment and water-resistant fabric.",
    price: 54.9,
    image_url: "https://picsum.photos/seed/citypack-backpack/900/600",
  },
  {
    id: 3,
    name: "Chrono Silver Watch",
    description:
      "Elegant stainless steel analog watch with a scratch-resistant glass finish.",
    price: 129.0,
    image_url: "https://picsum.photos/seed/chrono-silver-watch/900/600",
  },
  {
    id: 4,
    name: "Wave Pro Headphones",
    description:
      "Wireless headphones with active noise cancellation and up to 30 hours battery life.",
    price: 149.99,
    image_url: "https://picsum.photos/seed/wave-pro-headphones/900/600",
  },
  {
    id: 5,
    name: "ErgoFlex Office Chair",
    description:
      "Ergonomic office chair with adjustable lumbar support and breathable mesh seat.",
    price: 219.5,
    image_url: "https://picsum.photos/seed/ergoflex-chair/900/600",
  },
  {
    id: 6,
    name: "Aura Desk Lamp",
    description:
      "Modern LED desk lamp with dimming control and adjustable color temperature.",
    price: 39.95,
    image_url: "https://picsum.photos/seed/aura-desk-lamp/900/600",
  },
  {
    id: 7,
    name: "Retro X1 Camera",
    description:
      "Vintage-style compact camera with a 24MP sensor and 4K recording.",
    price: 499.0,
    image_url: "https://picsum.photos/seed/retro-x1-camera/900/600",
  },
];

cartitems = [
  {
    id: 1,
    itemId: 1,
    quantity: 1,
  },
  {
    id: 2,
    itemId: 2,
    quantity: 2,
  },
  {
    id: 3,
    itemId: 3,
    quantity: 3,
  },
];

cart = {
  cartid: 1,
  userid: 1,
  items: cartitems,
};

app.use(express.json());

app.get("/items", (req, res) => {
  res.status(200).json(items);
});

app.get("/items/:itemId", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.itemId));
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.status(200).json(item);
});

app.get("/cart", (req, res) => {
  res.status(200).json(cart);
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
  const cartItem = cartitems.find((i) => i.id === parseInt(req.params.cartitemId));
  if (!cartItem) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  cartItem.quantity = quantity;
  res.status(200).json(cartItem);
});

app.delete("/cart/:cartitemId", (req, res) => {
  const cartItemIndex = cartitems.findIndex(
    (i) => i.id === parseInt(req.params.cartitemId),
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

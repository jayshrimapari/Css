const express = require('express');
const bodyParser = require('body-parser');
const Joi = require("joi");
const mongoose = require('mongoose');
const { Hotel } = require("./hotel.model");

const app = express();
const connectionPromise = mongoose.connect("mongodb+srv://jayshrimapari5555:Whrgk3s0eK8aYM2b@cluster0.iltyn2z.mongodb.net/?retryWrites=true&w=majority")

app.use(bodyParser.json())
const hotels = [
    {
        "name": "raj",
        "id": "1",
        "price": 2000
    },
    {
        "name": "raigad",
        "id": "2",
        "price": 5000
    }
]

app.get('/api/hotel', async(req, res) => {
    // res.send('hello world!')
    const hotels = await Hotel.find({});
  return res.send(hotels);
});
app.get("/api/hotel/:hotelId", async (req, res) => {
    const { hotelId } = req.params;
    const hotel = await Hotel.findOne({ _id: hotelId });
    if (hotel) {
      return res.send(hotel);
    } else {
      return res
        .status(404)
        .send({ error: "Hotel not found. please try with a valid ID" });
    }
  });
  const postHotelSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    avgRating: Joi.number().min(0).max(10),
    price: Joi.number().integer().min(100).max(1000),
  });

  app.post("/api/hotel", async (req, res) => {
    const hotel = req.body;
    const { error } = postHotelSchema.validate(hotel);
    if (error) {
      return res.status(400).send({
        msg: error.message,
      });
    }
    const newHotel = new Hotel(hotel);
    const response = await newHotel.save();
    return res.status(201).send({
      msg: "succes hotel created",
      data: response.toJSON(),
    });
  });

  app.delete("/api/hotel/:hotelId", async (req, res) => {
    const { hotelId } = req.params;
    const hotel = await Hotel.findOneAndDelete({ _id: hotelId });
    if (!hotel) {
      return res
        .status(404)
        .send({ error: "Hotel not found. please try with a valid ID" });
    }
    return res.status(200).send({ msg: "Hotel removed successfully" });
  });
  
app.put('/api/hotel/:hotelId', (req,res) => {
    const {hotelId}=req.params;
    const hotel =req.body;

    const hotelIndex =hotels.findIndex((hotel) => hotel.id === hotelId);
    if (hotelIndex === -1){
        return res
        .status(404)
        .send({ error:"Hotel Not Found.Please try with a valid ID"});
    }
    hotels[hotelIndex] = {
        name:hotel.name,
        price:hotel.price,
        id:hotelId,
    };
    return res.status(200).send(hotels[hotelIndex]);
});

 connectionPromise
   .then(() => {
     app.listen(3000, () => {
      console.log("Server has started on port 3000");
     });
    })
   .catch((err) => {
    console.error("Error connecting to DB", err);
   });


const express = require("express");
const app = express();
const mongoose = require("mongoose");       // mongodb use krne k liye
const Listing = require("./models/listing.js"); // models k liye
const path = require("path");       // ejs k liye
const methodOverride = require("method-override");      // edit me PUT use krne k liye
const ejsMate = require("ejs-mate");    // boilerplate code ko use krne k liye

const MONGO_URL = "mongodb://127.0.0.1:27017/stayzendhruv";

main().then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));     // data ko parse krne k liye
app.use(methodOverride("_method"));             // edit.ejs k form me PUT request ko use krne k liye
app.engine('ejs',ejsMate);    // boilerplate code ko use krne k liye
app.use(express.static(path.join(__dirname,"/public/")));  // static file ko use krne k liye


// Basic API
app.get("/", (req, res) => {
    res.send("Hi, I am root.");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });
  
  //New Route
  app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  });
  
  //Edit Route
  app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route
  app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });

  //Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.listen(8080, () => {
    console.log("server is listening to port 8080.");
});
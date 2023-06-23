const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    location: {
      latitude: {
        type: String,
        default: ""
      },
      longitude: {
        type: String,
        default: ""
      }
    },
    title: {
      type: String,
      required: true,
      min: 8,
      max: 30,
    },
    description: {
      type: String,
      required: true,
    },
    adPicturePath: {
      type: String,
      required: true,
    },
    userPicturePath: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      max: 20,
    },
    itemRent: {
      type: Number,
      required: true,
    },
    rentDuration: {
      type: String,
      required: true,
    },
    securityRequirement: {
      type: String,
      required: true,
    },
    adStatus: {
      Activated: {
        type: Number,
        default: 1000,
      },
      Rented: Number,
      Deactivated: Number,
    },
  },
  { timestamps: true }
);

adSchema.index({ title: "text" });
const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;

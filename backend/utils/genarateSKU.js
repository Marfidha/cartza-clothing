import SkuCounter from "../models/SkuCounter.js";

export const generateSku = async (mainCategory, subCategory, color) => {
  const colorCode = color.substring(0, 3).toUpperCase(); // BLK
  const key = `${mainCategory}-${subCategory}-${color}`.toUpperCase();

  const counter = await SkuCounter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const number = String(counter.seq).padStart(3, "0");

  return `${key}-${number}`;
};
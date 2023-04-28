import { Schema, model, models } from "mongoose";

const emailSchema = new Schema({
  email: { type: String, required: true, trim: true, unique: true },
  type: {
    type: String,
    default: "Register",
    enum: ["Register", "Forget"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200,
  },
});

const Email = models.Email || model("Email", emailSchema);

export default Email;

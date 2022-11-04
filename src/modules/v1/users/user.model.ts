import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { UserInput } from "../../../types/interfaces/IUser";
import { env } from "@env";

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  resetExpires: Date;
  changedPasswordAfter(iat?: number): Promise<Boolean>;
  comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Tell us your name"],
      trim: true,
      minlength: [2, "The user name must have more or equal than 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Tell us your lastname"],
      trim: true,
      minlength: [
        2,
        "The user lastname must have more or equal than 2 characters",
      ],
    },
    email: {
      type: String,
      required: [true, "Tell us your email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
      minlength: 6,
      select: false,
    },
    level: {
      type: String,
      required: [true, "Provide a level"],
    },
    course: {
      type: String,
      required: [true, "Provide a course"],
      enum: ["BIS", "BM", "ECO", "FIN", "CL"],
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      required: false,
    },
    dob: {
      type: String,
      required: false,
      default: "2000-01-01",
    },
    emoji: {
      type: String,
      required: false,
      default: "👋",
    },
    modules: {
      type: [Object],
      required: false,
    },
    credits: {
      type: Number,
      required: [true, "Provide the credits"],
      default: 0,
    },
    status: {
      type: [String],
      required: false,
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("schedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(Number(process.env.saltWorkFactor) ?? 14);

  user.password = await bcrypt.hash(user.password, salt);

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.updatedAt) {
    const changedTimestamp = this.updatedAt.getTime() / 1000;

    return JWTTimestamp < Number(changedTimestamp);
  }

  return false;
};

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

export const User = mongoose.model<UserDocument>("User", userSchema);

import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhoto: String,
  },
  { timestamps: true, collection: 'players' },
);

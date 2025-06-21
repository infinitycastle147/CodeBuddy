import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount {
    provider: string;
    providerAccountId: string;
    type: string;
}

export interface IUser extends Document {
    username: string;
    password?: string;
    email: string;
    image?: string;
    isVerified: boolean;
    accounts?: IAccount[];
    createdAt: Date;
    updatedAt: Date;
}

const AccountSchema: Schema<IAccount> = new Schema({
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    type: { type: String, required: true },
});

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: false },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, "Please Enter valid email address"] },
    image: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    accounts: [AccountSchema],
}, {
    timestamps: true,
});

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
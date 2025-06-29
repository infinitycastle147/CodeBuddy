import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount {
    provider: string;
    providerAccountId: string;
    type: string;
}

export interface IUser extends Document {
    username: string;
    name: string; // 🔥 ADD: Display name (can be different from username)
    password?: string;
    email: string;
    image?: string;
    isVerified: boolean;
    role: string; // 🔥 ADD: User role for authorization
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
    username: { 
        type: String, 
        required: true, 
        trim: true,
        lowercase: true, // Ensure usernames are lowercase for consistency
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: false // Not required for OAuth users
    },
    email: { 
        type: String, 
        required: true, 
        lowercase: true, // Ensure emails are lowercase
        match: [/.+\@.+\..+/, "Please enter a valid email address"] 
    },
    image: { 
        type: String, 
        required: false 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'moderator'], // Define allowed roles
        default: 'user' 
    },
    accounts: [AccountSchema],
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// Indexes for better performance and uniqueness
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });

// Pre-save middleware to ensure name defaults to username if not provided
UserSchema.pre('save', function(next) {
    if (!this.name && this.username) {
        this.name = this.username;
    }
    next();
});

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
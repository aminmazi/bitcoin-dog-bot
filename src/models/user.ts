import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    telegramId: {
        type: Number,
        required: 'Enter a id',
        unique: true,
        index: true
    },
    language: {
        type: String,
        default: 'fa'
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    isBot: {
        type: Boolean
    },
    username: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    created_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});


const User = mongoose.model('User', UserSchema);

export default User;

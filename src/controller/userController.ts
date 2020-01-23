import User from '../models/user';

export default class UserController {
    // Get or create User
    public async findOrCreateUser(sender: any) {
        let user = await User.findOne({ telegramId: sender.id });
        if (!user) {
            try {
                const userModel = new User({
                    telegramId: sender.id,
                    firstName: sender.first_name,
                    lastName: sender.last_name,
                    username: sender.username,
                    isBot: sender.is_bot
                });
                user = await new User(userModel).save()
            } catch (err) {
                user = await User.findOne({ telegramId: sender.id });
            }
        }
        return user;
    }
}

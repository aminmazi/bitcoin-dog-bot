import UserController from '../controller/userController';

export async function attachUser(ctx: any, next: any) {
    if (ctx.from) {
        let userCtrl = new UserController();
        await userCtrl.findOrCreateUser(ctx.from);
    }
    next();
}

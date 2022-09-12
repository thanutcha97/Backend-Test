import Role from "src/auth/role.enum";

export class User {
    _id: string;
    username: string;
    password: string;
    role: Role
}

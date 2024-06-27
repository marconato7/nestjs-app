// import { UserEntity } from "../entities/user.entity";

// export type AuthenticationResponse = Omit<UserEntity, 'password'> & { token: string };
export type AuthenticationResponse = Omit<any, 'password'> & { token: string };

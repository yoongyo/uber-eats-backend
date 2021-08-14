import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role.decorator";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-email.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";


@Resolver(of => User)
export class UsersResolver{constructor(private readonly usersService: UserService){}
    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>{
        return this.usersService.createAccount(createAccountInput)
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.usersService.login(loginInput)
    }

    @Query(returns => User)
    @Role(['Any'])
    me(@AuthUser() authUser: User){
        return authUser
    }

    @Query(returns => UserProfileOutput)
    @Role(['Any'])
    async userProfile(@Args() userProfileInput:UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(userProfileInput.userId)
            if(!user) {
                throw Error();
            }
            return {
                ok: true,
                user,
            }
        } catch(e) {
            return {
                error: 'User Not Found',
                ok: false,
            }
        }
    }

    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    async editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(authUser.id, editProfileInput);
            return {
                ok: true,
            }
        } catch(error){
            return {
                ok: false,
                error
            }
        }
    }

    @Mutation(returns => VerifyEmailOutput)
    async verifyEmail(@Args('input') {code}: VerifyEmailInput): Promise<VerifyEmailOutput> {
        return this.usersService.verifyEmail(code);
    }
}
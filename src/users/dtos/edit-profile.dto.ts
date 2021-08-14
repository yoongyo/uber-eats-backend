import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";
import { User } from "../entities/user.entity";


@ObjectType()
export class EditProfileOutput extends CoreOutput {}


@InputType()
export class EditProfileInput extends PartialType(
    PickType(User, ["email", "password"])) {}


// PartionalType is maked optional
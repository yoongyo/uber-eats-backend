import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";
import { Order } from "../entities/order.entity";

@InputType()
export class EditOrderInput extends PickType(Order, ["id", "status"]) {}


@ObjectType()
export class EditORderOutput extends CoreOutput {}
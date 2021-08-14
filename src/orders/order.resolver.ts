import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { GetOrdersOutput, GetOrdersInput } from "./dtos/get-orders.dto";
import { GetOrderOutput, GetOrderInput } from "./dtos/get-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { EditOrderInput, EditORderOutput } from "./dtos/edit-order.dto";
import { Inject } from "@nestjs/common";
import { PUB_SUB } from "src/common/common.constants";
import { PubSub } from "graphql-subscriptions";



@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly ordersSerivce: OrderService, @Inject(PUB_SUB) private readonly pubSub: PubSub){}

    @Mutation(returns => CreateOrderOutput)
    @Role(["Client"])
    async createOrder(@AuthUser() customer: User, @Args('input') createOrderInput: CreateOrderInput): Promise<CreateOrderOutput> {
        return {
            ok: true,
        }
    }

    @Query(returns => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        return this.ordersSerivce.getOrders(user, getOrdersInput)
    }

    @Query(returns => GetOrderOutput)
    @Role(["Any"])
    async getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return this.ordersSerivce.getOrder(user, getOrderInput)
    }

    @Mutation(returns => EditORderOutput) 
    @Role(["Any"])
    async editOrder(@AuthUser() user: User, @Args('input') editOrderInput: EditOrderInput): Promise<EditORderOutput> {
        return this.ordersSerivce.editOrder(user, editOrderInput)
    }

    @Subscription(returns => String)
    orderSubscription() {
        return this.pubSub.asyncIterator("hot")
    }
}
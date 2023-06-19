import Fastify from 'fastify';
import { Cradle, diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { NameAndRegistrationPair } from "awilix";
import FastifyBasicAuth from "@fastify/basic-auth";
import { CreateBudgetItemFromTransactionCommand } from "./features/create-budget-item-from-transaction.command";
import { InvestecCardTransactionPayload } from "./models/investec-card-transaction-payload";
import { CommandExecutor } from "./cqrs/command-executor";
import { Containers } from "./di/containers";

export function buildApp(diContainers: NameAndRegistrationPair<Cradle>) {
    const app = Fastify({
        logger: process.env.NODE_ENV === "production"
    });
    app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true })
    app.register(FastifyBasicAuth, {
        validate: function (username, password, request, reply, done) {
            if (username === process.env.USERNAME
                && password === process.env.PASSWORD) {
                return done();
            }
            done(new Error('Unauthorized'));
        }
    });
    diContainer.register(diContainers);
    app.after(() => {
        app.route({
            method: "POST",
            url: "/transaction",
            onRequest: app.basicAuth,
            schema: {
                body: {
                    required: [
                        "dateTime",
                        "reference",
                        "centsAmount",
                        "accountNumber",
                        "type",
                        "currencyCode",
                        "card",
                        "merchant"
                    ],
                    type: "object",
                    properties: {
                        dateTime: { type: "string" },
                        reference: { type: "string" },
                        centsAmount: { type: "number" },
                        accountNumber: { type: "string" },
                        type: { type: "string" },
                        currencyCode: { type: "string" },
                        card: {
                            type: "object",
                            properties: {
                                id: { type: "string" }
                            }
                        },
                        merchant: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                category: {
                                    type: "object",
                                    properties: {
                                        code: { type: "number" },
                                        name: { type: "string" },
                                        key: { type: "string" }
                                    }
                                },
                                city: { type: "string" },
                                country: {
                                    type: "object",
                                    properties: {
                                        code: { type: "string" },
                                        name: { type: "string" },
                                        alpha3: { type: "string" }
                                    }
                                },
                            }
                        }
                    }
                }
            },
            handler: async (
                request,
                reply) => {
                const commandExecutor = request.diScope.resolve<CommandExecutor>(Containers.CommandExecutor);
                try {
                    const result = await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(request.body as InvestecCardTransactionPayload));
                } catch (e) {
                    console.log(e);
                }
                return "ok!";
            }
        });
    });
    return app;
}
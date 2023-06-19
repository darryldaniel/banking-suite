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
        app.options(
            "/",
            () => "ok!");
        app.route({
            method: "POST",
            url: "/transaction",
            onRequest: app.basicAuth,
            schema: {
                body: {
                    type: "object",
                    properties: {
                        transactionString: {
                            type: "string"
                        }
                    }
                }
            },
            handler: async (request) => {
                const transaction: InvestecCardTransactionPayload = JSON.parse(
                    (request.body as { transactionString: string }).transactionString);
                const commandExecutor = request.diScope.resolve<CommandExecutor>(Containers.CommandExecutor);
                try {
                    await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(transaction));
                } catch (e) {
                    console.error(e);
                }
                return "ok!";
            }
        });
    });
    return app;
}
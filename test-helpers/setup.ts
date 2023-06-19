import DotEnv from "dotenv";

export default function() {
    DotEnv.config({
        path: ".env.test"
    });
}

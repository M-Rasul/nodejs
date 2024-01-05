import {Request as ExpressRequest, Response, NextFunction} from "express";
import { getUserById } from "../model/User";
import { IncomingHttpHeaders } from 'http';

// HEADERS INTERFACE
interface Headers extends IncomingHttpHeaders {
    "x-user-id": string;
};

// REQUEST WITH HEADERS
interface RequestWithHeaders<ReqHeaders extends IncomingHttpHeaders> extends ExpressRequest {
    headers: ReqHeaders;
};

// RESPONSE INTERFACE
interface ResponseBody {
    error?: string;
    ok: boolean;
};

export const checkUserId = async function(req: RequestWithHeaders<Headers>, res: Response<ResponseBody>, next: NextFunction) {
    // GET USER ID
    const userId = req.headers?.["x-user-id"];

    // IF NO ID HEADER WAS PROVIDED
    if (!userId) {
        res
            .status(400)
            .send({
                error: "X-user-id headers were not set",
                ok: false,
            });
        return;
    }

    // GET THAT USER
    const user = await getUserById(+userId);

    // GETTING THAT USER
    if (!user) {

        // SEND ERROR
        res
            .status(401)
            .send({
                error: "User with specified id was not found",
                ok: false,
            });
        return;
    }
    next();
};
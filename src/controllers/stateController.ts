import { states } from "../globalVariables.ts"

export const getCurrentScrollState = (req: Request, res: Response) => {
    try
    {
        const currentState = states.scrollState;
        return res.send({ status: "SUCCESS", state: states.scrollState });
    }
    catch(error)
    {
        console.error(error);
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
}

export const getAllStates = (req: Request, res: Response) => {
    try
    {
        const stateObj = states;
        return res.send({ status: "SUCCESS", state: stateObj });
    }
    catch(error)
    {
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
}
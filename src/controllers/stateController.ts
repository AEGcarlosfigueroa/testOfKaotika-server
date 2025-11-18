import { scrollState } from "../globalVariables"

export const getCurrentScrollState = (req: Request, res: Response) => {
    try
    {
        const currentState = scrollState;
        return res.send({ status: "SUCCESS", state: scrollState });
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
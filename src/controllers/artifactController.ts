import * as artifactService from './../services/artifactService.ts'

export async function getAllArtifacts(req: Request, res: Response)
{
    try
    {
        const artifacts = artifactService.getAllArtifacts();
        if(artifacts.length === 0)
        {
            return res.status(404).send({ message: 'No artifacts found!' });
        }

        return res.send({ status: "SUCCESS", artifactData: artifacts });
    }
    catch(error: any)
    {
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
}
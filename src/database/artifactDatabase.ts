import artifactModel from "../models/artifactModel.ts";

export async function getAllArtifacts()
{
    try
    {
        const artifacts = await artifactModel.find();
        return artifacts;
    }
    catch(error)
    {
        throw error;
    }
}

export async function getArtifactById(id: string)
{
    try
    {
        const artifact = await artifactModel.findOne({artifactID: id});
        return artifact;
    }
    catch(error)
    {
        throw error;
    }
}
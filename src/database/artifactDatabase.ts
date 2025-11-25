import artifactModel from "../models/artifactModel.ts";

export function getAllArtifacts()
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
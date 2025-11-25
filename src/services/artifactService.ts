import * as artifactDatabase from './../database/artifactDatabase.ts'

export function getAllArtifacts()
{
    try
    {
        const artifacts = await artifactDatabase.getAllArtifacts();
        return artifacts;
    }
    catch(error)
    {
        throw error;
    }
}
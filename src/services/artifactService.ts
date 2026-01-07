import * as artifactDatabase from './../database/artifactDatabase.ts';

export async function getAllArtifacts()
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

export async function getArtifactById(id: string)
{
    try
    {
        const artifact = await artifactDatabase.getArtifactById(id);
        return artifact;
    }
    catch(error)
    {
        throw error;
    }
}
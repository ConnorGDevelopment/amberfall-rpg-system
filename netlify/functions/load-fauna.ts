import { Handler } from '@netlify/functions'
import faunadb from 'faunadb'

const handler: Handler = async () => {
  if(process.env.FAUNADB_SECRET_KEY) {
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET_KEY
    })


    try {
      const characters = await client.query(q.Map(
        q.Paginate(q.Documents(q.Collection('characters'))),
        q.Lambda(x => q.Get(x))
      ))
      const jobs = await client.query(q.Map(
        q.Paginate(q.Documents(q.Collection('jobs'))),
        q.Lambda(x => q.Get(x))
      ))
      const skills = await client.query(q.Map(
        q.Paginate(q.Documents(q.Collection('skills'))),
        q.Lambda(x => q.Get(x))
      ))
      return {
        statusCode: 200,
        body: JSON.stringify({characters, jobs, skills})
      }
    } catch(e) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Collection Not Found'
        })
      }
    }

  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Unknown Error'
      })
    }
  }
}

export {handler}

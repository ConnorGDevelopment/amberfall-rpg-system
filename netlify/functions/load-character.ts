import { Handler, HandlerEvent } from '@netlify/functions'
import faunadb from 'faunadb'

const handler: Handler = async (event: HandlerEvent) => {
  if(process.env.FAUNADB_SECRET_KEY && event.body) {
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET_KEY
    })

    const payload = JSON.parse(event.body) as {id: number}

    try {
      const character = await client.query(q.Let(
        {
          character: q.Ref(q.Collection('characters'), payload.id),
        },
        {
          id: q.Select('id', q.Var('character')),
          data: q.Select('data', q.Get(q.Var('character'))),
          test: q.Get(q.Ref(q.Collection('jobs'), q.Select(['data', 'job'], q.Get(q.Var('character')))))
        }
      )
        )
      return {
        statusCode: 200,
        body: JSON.stringify({
          character
        })
      }
    } catch(e: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: e.message
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

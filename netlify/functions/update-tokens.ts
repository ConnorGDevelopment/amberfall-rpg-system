import { Handler, HandlerEvent } from '@netlify/functions'
import faunadb from 'faunadb'
import { Character } from '~/model/character';

const handler: Handler = async (event: HandlerEvent) => {
  if(process.env.FAUNADB_SECRET_KEY && event.body) {
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET_KEY
    })

    const payload = JSON.parse(event.body) as {id: Character['id'], triumph: number, ruin: number}

    try {
      const updatedCharacter = await client.query(
        q.Update(
          q.Ref(
            q.Collection('characters'),
            payload.id
          ),
          {
            data: {
              triumph: payload.triumph,
              ruin: payload.ruin
            }
          }
        )
      )
      return {
        statusCode: 200,
        body: JSON.stringify({
          updatedCharacter
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
        message: 'Configuration Error'
      })
    }
  }
}

export {handler}

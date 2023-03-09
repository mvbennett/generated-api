
    import { MongoClient } from 'mongodb';
    import type { NextApiRequest, NextApiResponse } from 'next'

    export default async function handler(
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      const uri = process.env.MONGODB_URI;
      const client = await new MongoClient(uri as string);
      const collection = client.db('dynamicapi').collection('params');

      switch (req.method) {
        case 'GET': {
          const paramResult = await collection.findOne({ param: 'name' });
          const param = {
            name: paramResult?.value || 'This param currently has no value',
          };
          res.status(200).json(param);
          break;
        }
        case 'POST': {
          const { name } = req.body;
          if (!name) {
            res.status(400).json({ error: 'Please use an name parameter and give it a value' });
            break;
          }
          await collection.updateOne(
            { param: 'name' },
            { $set: { value: name } },
            { upsert: true }
          );
          res.status(200).json({ message: 'name parameter value updated successfully' });
          break;
        }
        default: {
          res.status(405).json({ error: 'Method not allowed' });
          break;
        }
      }
    }
    
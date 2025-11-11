import { Router } from 'express'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { nanoid } from 'nanoid'
type Data = { assets: any[] }
const file = join(__dirname, '../../data/db.json')
const adapter = new JSONFile<Data>(file)
const db = new Low<Data>(adapter)
async function init(){ await db.read(); db.data = db.data || { assets: [] }; await db.write() }
init()
const router = Router()
router.get('/', async (req,res)=>{ await db.read(); res.json(db.data?.assets || []) })
router.post('/', async (req,res)=>{ await db.read(); const asset = { id: nanoid(), ...req.body }; db.data!.assets.push(asset); await db.write(); res.status(201).json(asset) })
router.get('/:id', async (req,res)=>{ await db.read(); const a = db.data!.assets.find(x=> x.id===req.params.id); if(!a) return res.status(404).json({error:'not found'}); res.json(a) })
export default router

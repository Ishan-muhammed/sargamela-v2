import { GlobalAfterChangeHook } from 'payload'

const afterChangeFestSettings: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  const io = (payload as any).io
  io.to('').emit('settings', { message: doc })
  //   console.log(doc)
}

const hooks = {
  afterChange: [afterChangeFestSettings],
}

export default hooks

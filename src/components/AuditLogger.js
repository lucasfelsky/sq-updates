// simple logger that writes to /audits
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function logAudit({ entity, action, userId, diff }) {
  try {
    await addDoc(collection(db, 'audits'), {
      entity,
      action,
      userId: userId || null,
      diff: diff || null,
      timestamp: serverTimestamp()
    })
    return true
  } catch (err) {
    console.error('audit log failed', err)
    return false
  }
}

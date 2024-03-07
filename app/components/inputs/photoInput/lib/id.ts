export default function makeId() {
  const id = Date.now().toString(36) + Math.random().toString(36)
  return id
}

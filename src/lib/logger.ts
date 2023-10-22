export default function Logger(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${message}`);
}

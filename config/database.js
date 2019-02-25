import mongoose from 'mongoose'

mongoose.Types.ObjectId.prototype.view = function () {
  return { id: this.toString() }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ' + err)
  process.exit(-1)
})

mongoose.connection.once('open', () => {
  console.info('MongoDB connected')
})

export default mongoose

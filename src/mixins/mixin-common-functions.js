import { firebaseStore } from 'boot/firebase'

export default {
  data: function () {
    return {

    }
  },
  methods: {
    async delDocsFromFS (collectionName, params) {
      // Build query with first parameter
      let key = Object.keys(params[0])
      let valueObj = Object.values(params[0])
      let field = key[0]
      let value = valueObj[0]

      const collection = await firebaseStore.collection(collectionName)
      let query = collection.where(field, '==', value)

      // If more than one parameter passed, add additional where clauses to query
      for (let i = 1; i < params.length; i++) {
        key = Object.keys(params[i])
        valueObj = Object.values(params[i])
        field = key[0]
        value = valueObj[0]
        query = query.where(field, '==', value)
      }
      // Get documents using query
      const snapshot = await query.get()
      if (!snapshot.empty) {
        // Once we get the results, begin a batch
        var batch = firebaseStore.batch()

        snapshot.forEach((doc) => {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref)
        })
        // Commit the batch
        return batch.commit()
      } else {
        return 'Error deleting scores'
      }
    },

    // Add document to collection passed from function
    async addObjectToFS (object, collectionName) {
      // Add scores by hole to FireStore daily scorecard collection
      const collection = firebaseStore.collection(collectionName)
      return collection.add(Object.assign({}, object))
    }
  }
}

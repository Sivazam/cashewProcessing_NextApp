// lib/workers.ts
import workersData from "../data/workerData.json"; // Adjust the path to your JSON file

export async function getStaticWorkers() {
  // Simulate fetching static data (e.g., from a JSON file)
  return workersData;
}


// import { firestore } from "@/lib/firebase";

// export async function getStaticWorkers() {
//   const snapshot = await firestore.collection("workers").get();
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// export async function getWorkerById(id: string) {
//   const doc = await firestore.collection("workers").doc(id).get();
//   return { id: doc.id, ...doc.data() };
// }

// export async function updateWorker(id: string, updates: any) {
//   await firestore.collection("workers").doc(id).update(updates);
// }


// "use client";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { Firm, Worker, WorkLog, Payment, AppSettings } from "./types";

// // Firms Store
// interface FirmsState {
//   firms: Firm[];
//   selectedFirmId: string | null;
//   addFirm: (firm: Firm) => void;
//   updateFirm: (id: string, data: Partial<Firm>) => void;
//   deleteFirm: (id: string) => void;
//   selectFirm: (id: string) => void;
//   getSelectedFirm: () => Firm | undefined;
// }
// export const useFirmsStore = create<FirmsState>()(
//   persist(
//     (set, get) => ({
//       firms: [],
//       selectedFirmId: null,
//       addFirm: (firm) => set((state) => ({ firms: [...state.firms, firm] })),
//       updateFirm: (id, data) =>
//         set((state) => ({
//           firms: state.firms.map((firm) =>
//             firm.id === id ? { ...firm, ...data } : firm
//           ),
//         })),
//       deleteFirm: (id) =>
//         set((state) => ({
//           firms: state.firms.filter((firm) => firm.id !== id),
//           selectedFirmId:
//             state.selectedFirmId === id ? null : state.selectedFirmId,
//         })),
//       selectFirm: (id) => set({ selectedFirmId: id }),
//       getSelectedFirm: () => {
//         const { firms, selectedFirmId } = get();
//         return firms.find((firm) => firm.id === selectedFirmId);
//       },
//     }),
//     {
//       name: "firms-storage",
//     }
//   )
// );

// // Workers Store
// interface WorkersState {
//   workers: Worker[];
//   addWorker: (worker: Worker) => void;
//   // updateWorker: (id: string, data: Partial<Worker>) => void;
//   updateWorker: (id: string, data: Partial<Worker> & { payoutAmount?: number }) => void;
//   deleteWorker: (id: string) => void;
//   getWorkersByFirm: (firmId: string) => Worker[];
// }
// export const useWorkersStore = create<WorkersState>()(
//   persist(
//     (set, get) => ({
//       workers: [],
//       addWorker: (worker) =>
//         set((state) => ({
//           workers: [
//             ...state.workers,
//             {
//               ...worker,
//               totalAmount: worker.totalAmount || 0, // Default to 0
//               advanceAmount: worker.advanceAmount || 0, // Default to 0
//             },
//           ],
//         })),
//       updateWorker: (id, data) =>
//         set((state) => ({
//           workers: state.workers.map((worker) =>
//             worker.id === id
//               ? {
//                   ...worker,
//                   ...data,
//                   totalAmount: (data.totalAmount ?? worker.totalAmount) || 0,
//                   advanceAmount: (data.advanceAmount ?? worker.advanceAmount) || 0,
//                   // payoutsMade: (worker.payoutsMade || 0) + payoutAmount,
//                   // payoutsMade: (worker.payoutsMade || 0),
//                   payoutsMade: (worker.payoutsMade || 0) + (data.payoutAmount || 0),
//                 }
//               : worker
//           ),
//         })),
//       deleteWorker: (id) =>
//         set((state) => ({
//           workers: state.workers.filter((worker) => worker.id !== id),
//         })),
//       getWorkersByFirm: (firmId) => {
//         const { workers } = get();
//         return workers.filter((worker) => worker.firmId === firmId);
//       },
//     }),
//     {
//       name: "workers-storage",
//     }
//   )
// );

// // Initialize payoutsMade for existing workers
// export function initializePayoutsMade() {
//   const { workers, updateWorker } = useWorkersStore.getState();
//   workers.forEach((worker) => {
//     if (worker.payoutsMade === undefined) {
//       updateWorker(worker.id, { payoutsMade: 0 });
//     }
//   });
// }


// // Logs Store (WorkLogs and Payments)
// interface LogsState {
//   workLogs: WorkLog[];
//   payments: Payment[];
//   addWorkLog: (log: WorkLog) => void;
//   updateWorkLog: (id: string, data: Partial<WorkLog>) => void;
//   deleteWorkLog: (id: string) => void;
//   addPayment: (payment: Payment) => void;
//   updatePayment: (id: string, data: Partial<Payment>) => void;
//   deletePayment: (id: string) => void;
//   getWorkLogsByWorker: (workerId: string) => WorkLog[];
//   getPaymentsByWorker: (workerId: string) => Payment[];
//   getWorkLogsByFirm: (firmId: string) => WorkLog[];
//   getPaymentsByFirm: (firmId: string) => Payment[];
// }
// export const useLogsStore = create<LogsState>()(
//   persist(
//     (set, get) => ({
//       workLogs: [],
//       payments: [],
//       addWorkLog: (log) =>
//         set((state) => ({ workLogs: [...state.workLogs, log] })),
//       updateWorkLog: (id, data) =>
//         set((state) => ({
//           workLogs: state.workLogs.map((log) =>
//             log.id === id ? { ...log, ...data } : log
//           ),
//         })),
//       deleteWorkLog: (id) =>
//         set((state) => ({
//           workLogs: state.workLogs.filter((log) => log.id !== id),
//         })),
//      addPayment: (payment) => {
//   set((state) => {
//     if (payment.type === "advance") {
//       // Increase advanceAmount
//       useWorkersStore.getState().updateWorker(payment.workerId, {
//         advanceAmount: (prev) => (prev || 0) + payment.amount,
//       });
//     } else if (payment.type === "payout") {
//       // Deduct payout from advanceAmount first, then from totalAmount
//       useWorkersStore.getState().updateWorker(payment.workerId, (worker) => {
//         const remainingAdvance = Math.max(0, (worker.advanceAmount || 0) - payment.amount);
//         const remainingPayout = payment.amount - (worker.advanceAmount || 0);

//         return {
//           advanceAmount: remainingAdvance, // Reduce advanceAmount first
//           totalAmount: (worker.totalAmount || 0) - (remainingPayout > 0 ? remainingPayout : 0), // Deduct remaining payout from totalAmount
//         };
//       });
//     } else if (payment.type === "clear_advance") {
//       // Clear advanceAmount
//       useWorkersStore.getState().updateWorker(payment.workerId, {
//         advanceAmount: 0,
//       });
//     }

//     return { payments: [...state.payments, payment] };
//   });
// },
//       updatePayment: (id, data) =>
//         set((state) => ({
//           payments: state.payments.map((payment) =>
//             payment.id === id ? { ...payment, ...data } : payment
//           ),
//         })),
//       deletePayment: (id) =>
//         set((state) => ({
//           payments: state.payments.filter((payment) => payment.id !== id),
//         })),
//       getWorkLogsByWorker: (workerId) => {
//         const { workLogs } = get();
//         return workLogs.filter((log) => log.workerId === workerId);
//       },
//       getPaymentsByWorker: (workerId) => {
//         const { payments } = get();
//         return payments.filter((payment) => payment.workerId === workerId);
//       },
//       getWorkLogsByFirm: (firmId) => {
//         const { workLogs } = get();
//         return workLogs.filter((log) => log.firmId === firmId);
//       },
//       getPaymentsByFirm: (firmId) => {
//         const { payments } = get();
//         return payments.filter((payment) => payment.firmId === firmId);
//       },
//     }),
//     {
//       name: "logs-storage",
//     }
//   )
// );

// // Settings Store
// interface SettingsState {
//   settings: AppSettings;
//   updateSettings: (data: Partial<AppSettings>) => void;
// }
// export const useSettingsStore = create<SettingsState>()(
//   persist(
//     (set) => ({
//       settings: {
//         pricePerKg: 2, // Default price per kg
//         currency: "₹", // Default currency
//         theme: "light", // Default theme
//       },
//       updateSettings: (data) =>
//         set((state) => ({
//           settings: { ...state.settings, ...data },
//         })),
//     }),
//     {
//       name: "settings-storage",
//     }
//   )
// );

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Firm, Worker, WorkLog, Payment, AppSettings } from "./types";

// Firms Store
interface FirmsState {
  firms: Firm[];
  selectedFirmId: string | null;
  addFirm: (firm: Firm) => void;
  updateFirm: (id: string, data: Partial<Firm>) => void;
  deleteFirm: (id: string) => void;
  selectFirm: (id: string) => void;
  getSelectedFirm: () => Firm | undefined;
}
export const useFirmsStore = create<FirmsState>()(
  persist(
    (set, get) => ({
      firms: [],
      selectedFirmId: null,
      addFirm: (firm) => set((state) => ({ firms: [...state.firms, firm] })),
      updateFirm: (id, data) =>
        set((state) => ({
          firms: state.firms.map((firm) =>
            firm.id === id ? { ...firm, ...data } : firm
          ),
        })),
      deleteFirm: (id) =>
        set((state) => ({
          firms: state.firms.filter((firm) => firm.id !== id),
          selectedFirmId:
            state.selectedFirmId === id ? null : state.selectedFirmId,
        })),
      selectFirm: (id) => set({ selectedFirmId: id }),
      getSelectedFirm: () => {
        const { firms, selectedFirmId } = get();
        return firms.find((firm) => firm.id === selectedFirmId);
      },
    }),
    {
      name: "firms-storage",
    }
  )
);

// Workers Store
interface WorkersState {
  workers: Worker[];
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, data: Partial<Worker> & { payoutAmount?: number }) => void;
  deleteWorker: (id: string) => void;
  getWorkersByFirm: (firmId: string) => Worker[];
}
export const useWorkersStore = create<WorkersState>()(
  persist(
    (set, get) => ({
      workers: [],
      addWorker: (worker) =>
        set((state) => ({
          workers: [
            ...state.workers,
            {
              ...worker,
              totalAmount: worker.totalAmount || 0, // Default to 0
              advanceAmount: worker.advanceAmount || 0, // Default to 0
              payoutsMade: worker.payoutsMade || 0, // Default to 0
            },
          ],
        })),
      updateWorker: (id, data) =>
        set((state) => ({
          workers: state.workers.map((worker) =>
            worker.id === id
              ? {
                  ...worker,
                  ...data,
                  totalAmount: (data.totalAmount ?? worker.totalAmount) || 0,
                  advanceAmount: (data.advanceAmount ?? worker.advanceAmount) || 0,
                  payoutsMade: (worker.payoutsMade || 0) + (data.payoutAmount || 0),
                }
              : worker
          ),
        })),
      deleteWorker: (id) =>
        set((state) => ({
          workers: state.workers.filter((worker) => worker.id !== id),
        })),
      getWorkersByFirm: (firmId) => {
        const { workers } = get();
        return workers.filter((worker) => worker.firmId === firmId);
      },
    }),
    {
      name: "workers-storage",
    }
  )
);

// Initialize payoutsMade for existing workers
export function initializePayoutsMade() {
  const { workers, updateWorker } = useWorkersStore.getState();
  workers.forEach((worker) => {
    if (worker.payoutsMade === undefined) {
      updateWorker(worker.id, { payoutsMade: 0 });
    }
  });
}

// Logs Store (WorkLogs and Payments)
interface LogsState {
  workLogs: WorkLog[];
  payments: Payment[];
  addWorkLog: (log: WorkLog) => void;
  updateWorkLog: (id: string, data: Partial<WorkLog>) => void;
  deleteWorkLog: (id: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getWorkLogsByWorker: (workerId: string) => WorkLog[];
  getPaymentsByWorker: (workerId: string) => Payment[];
  getWorkLogsByFirm: (firmId: string) => WorkLog[];
  getPaymentsByFirm: (firmId: string) => Payment[];
}
export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      workLogs: [],
      payments: [],
      addWorkLog: (log) =>
        set((state) => ({ workLogs: [...state.workLogs, log] })),
      updateWorkLog: (id, data) =>
        set((state) => ({
          workLogs: state.workLogs.map((log) =>
            log.id === id ? { ...log, ...data } : log
          ),
        })),
      deleteWorkLog: (id) =>
        set((state) => ({
          workLogs: state.workLogs.filter((log) => log.id !== id),
        })),
      addPayment: (payment) => {
        set((state) => {
          if (payment.type === "advance") {
            // Increase advanceAmount
            useWorkersStore.getState().updateWorker(payment.workerId, {
              advanceAmount: (prev) => (prev || 0) + payment.amount,
            });
          } else if (payment.type === "payout") {
            // Deduct payout from advanceAmount first, then from totalAmount
            useWorkersStore.getState().updateWorker(payment.workerId, (worker) => {
              const remainingAdvance = Math.max(0, (worker.advanceAmount || 0) - payment.amount);
              const remainingPayout = payment.amount - (worker.advanceAmount || 0);

              return {
                advanceAmount: remainingAdvance, // Reduce advanceAmount first
                totalAmount: (worker.totalAmount || 0) - (remainingPayout > 0 ? remainingPayout : 0), // Deduct remaining payout from totalAmount
                payoutsMade: (worker.payoutsMade || 0) + payment.amount, // Track total payouts made
              };
            });
          } else if (payment.type === "clear_advance") {
            // Clear advanceAmount
            useWorkersStore.getState().updateWorker(payment.workerId, {
              advanceAmount: 0,
            });
          }

          return { payments: [...state.payments, payment] };
        });
      },
      updatePayment: (id, data) =>
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id ? { ...payment, ...data } : payment
          ),
        })),
      deletePayment: (id) =>
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
        })),
      getWorkLogsByWorker: (workerId) => {
        const { workLogs } = get();
        return workLogs.filter((log) => log.workerId === workerId);
      },
      getPaymentsByWorker: (workerId) => {
        const { payments } = get();
        return payments.filter((payment) => payment.workerId === workerId);
      },
      getWorkLogsByFirm: (firmId) => {
        const { workLogs } = get();
        return workLogs.filter((log) => log.firmId === firmId);
      },
      getPaymentsByFirm: (firmId) => {
        const { payments } = get();
        return payments.filter((payment) => payment.firmId === firmId);
      },
    }),
    {
      name: "logs-storage",
    }
  )
);

// Settings Store
interface SettingsState {
  settings: AppSettings;
  updateSettings: (data: Partial<AppSettings>) => void;
}
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        pricePerKg: 2, // Default price per kg
        currency: "₹", // Default currency
        theme: "light", // Default theme
      },
      updateSettings: (data) =>
        set((state) => ({
          settings: { ...state.settings, ...data },
        })),
    }),
    {
      name: "settings-storage",
    }
  )
);
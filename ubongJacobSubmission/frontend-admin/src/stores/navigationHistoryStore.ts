import { createWithEqualityFn } from 'zustand/traditional';
import { createJSONStorage, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// interface IExampleStoreWithPersist {
//   example: string;
//   setExample: (text: string) => void;
// }

// const exampleStoreWithPersist = create(
//   persist<IExampleStoreWithPersist>(
//     (set) => ({
//       example: "",
//       setExample: (example) => set(() => ({ example })),
//     }),
//     {
//       name: "exampleStoreWithPersist",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

interface INavigationHistoryStore {
  history: string[];
  redirectedFromPath: string | null;
  deleteLastRoute: () => void;
  setHistory: (pathName: string) => void;
  setRedirectedFromPath: (pathName: string | null) => void;
}

const storeName = 'useNavigationHistoryStore';

export const useNavigationHistoryStore = createWithEqualityFn(
  persist<Readonly<INavigationHistoryStore>>(
    (set, get) => ({
      // INITIAL STATE
      history: [],
      redirectedFromPath: null,

      // ACTIONS AND MUTATORS

      deleteLastRoute: () =>
        set(() => ({
          history: [...get().history.slice(0, get().history.length - 1)],
        })),

      setHistory: (pathName) => {
        if (get().history.length >= 5) {
          return set(() => ({
            history: [...get().history.slice(1, 5), pathName],
          }));
        } else return set(() => ({ history: [...get().history, pathName] }));
      },

      setRedirectedFromPath: (redirectedFromPath) =>
        set(() => ({ redirectedFromPath })),
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => sessionStorage),
    }
  ),
  shallow
);

import { createContext } from 'react';

// const InitChange = false;
export const BillContext = createContext({initState: false, dispatch: (b: boolean) => {}})
// export default {InitChange, BillContext}

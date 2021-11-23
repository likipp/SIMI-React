import { createContext } from 'react';

// const InitChange = false;
export const BillContext = createContext({initState: false, updateState: (b: boolean) => {}})
// export default {InitChange, BillContext}

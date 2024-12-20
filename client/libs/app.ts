import { createContext } from "react";


export const AppContext = createContext({
    setPassionData: (data) => {},
    getPassionData: (): any => {}
});

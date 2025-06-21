import { createContext, useState } from "react";

export const CounterContext = createContext(null);

export const CounterProvider = (props) =>{
    const[position,setPosition] = useState(null);
    return (
        <CounterContext.Provider value={{position,setPosition}}>
            {props.children}
        </CounterContext.Provider>
    )
}
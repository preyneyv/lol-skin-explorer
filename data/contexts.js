import React from "react";

export const DataContext = React.createContext({});
DataContext.displayName = "DataContext";

export const DataProvider = DataContext.Provider;
export const useData = () => React.useContext(DataContext);

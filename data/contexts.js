import React from "react";

export const PropsContext = React.createContext({});
PropsContext.displayName = "PropsContext";

export const PropsProvider = PropsContext.Provider;
export const useProps = () => React.useContext(PropsContext);

import React, { useState } from "react";

export interface connectionProps {
  docId: string;
  password: string;
  maxConns: number;
  create: boolean;
}

export const defaultConnection: connectionProps = {
  docId: "",
  password: "",
  maxConns: 1,
  create: true,
};

const ConnContext = React.createContext({
  conn: defaultConnection,
  updateConn: (newConn: connectionProps) => {},
});

export function ConnContextProvider(props) {
  const [conn, updateConn] = useState(defaultConnection);
  return (
    <ConnContext.Provider value={{ conn, updateConn }}>
      {props.children}
    </ConnContext.Provider>
  );
}

export default ConnContext;

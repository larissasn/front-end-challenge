"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileContextType {
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ selectedFileId, setSelectedFileId }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context)
    throw new Error("useFileContext must be used within FileProvider");
  return context;
};

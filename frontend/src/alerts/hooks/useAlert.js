import { useContext } from "react";
import { useAlert as useCtx } from "../context/AlertContext";

export default function useAlert() {
  return useCtx();
}
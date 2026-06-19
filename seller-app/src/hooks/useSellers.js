import { useQuery } from "@tanstack/react-query";
import { getSellers } from "../services/sellerApi";

export default function useSellers() {
  return useQuery({
    queryKey: ["sellers"],
    queryFn: getSellers,
    staleTime: 1000 * 60 * 10,
  });
}
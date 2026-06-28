import { useQuery } from "@tanstack/react-query";
import { getAllSeller, getSellers } from "../services/sellerApi";

export default function useSellers() {
  return useQuery({
    queryKey: ["sellers"],
    queryFn: getAllSeller,
    staleTime: 1000 * 60 * 10,
  });
}